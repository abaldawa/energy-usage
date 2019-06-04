/**
 * User: abhijit.baldawa
 *
 * This module initializes all the pre-requisites and then starts the koa server
 */

const
    Koa = require('koa'),
    koaBodyParser = require('koa-body'),
    logger = require('./logger/logger'),
    database = require('./database/dbConnection'),
    initDBModels = require('./database/models'),
    metersRouter = require('./routes/meters.routes'),
    {responseTimeLoggerMiddleware} = require('./middleware'),
    {formatPromiseResult} = require('./utils/util'),
    {getPort} = require('./config/config'),
    server = new Koa();

/**
 * Immediately invoking async method which does all the standard server startup routine.
 */
(async () => {
    const
        PORT = getPort();

    let
        err,
        dbConnection;

    if( !PORT ) {
        logger.error(`Cannot start server as port information is missing`);
        process.exit(1);
    }

    // --------------------- 1. Add all the required koa middleware and routes---------------------
    server.use(koaBodyParser());
    server.use(responseTimeLoggerMiddleware);
    server.use(metersRouter.routes()); // "/meters" routes
    // ----------------------------------- 1. END -------------------------------------------------


    // ----------------------- 2. initialize database connection -------------------------------------
    [err, dbConnection] = await formatPromiseResult( database.createConnection() );

    if( err ) {
        logger.error(`Failed to connect to SQLite database. Error: ${err.stack || err}. Stopping server...`);
        process.exit(1);
    }

    logger.info('Connected to SQLite database.');
    // ----------------------------------- 2. END ----------------------------------------------------


    // -------------------- 3. Initialize DB models with db connection --------------------
    [err] = await formatPromiseResult( initDBModels( dbConnection ) );

    if(err) {
        logger.error(`Error initializing DB models. Error: ${err.stack || err}. Stopping the server`);
        process.exit(1);
    }
    // -------------------------------------- 3. END --------------------------------------


    // ------------------------------ 3. Start Http Server -------------------------------------------
    [err] = await formatPromiseResult(
                    new Promise( (resolve, reject) => {
                        server.listen(PORT, () => {
                            resolve();
                        })
                        .on('error', (err) => {
                            reject(err);
                        })
                    } )
                  );

    if( err ) {
        logger.error(`Error while starting server on port = ${PORT}. Error: ${err.stack || err}. Exiting...`);
        process.exit(1);
    }

    logger.info(`Server is listening on port = ${PORT}`);
    // --------------------------------- 3. END -------------------------------------------------------
})();