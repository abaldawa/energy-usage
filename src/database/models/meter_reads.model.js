/**
 * User: abhijit.baldawa
 *
 * This module exposes methods which interact with DB and perform the CRUD operations on meter_reads database table
 */

const
    {formatPromiseResult} = require('../../utils/util'),
    logger = require('../../logger/logger');

let
    db;

/**
 * @method PRIVATE
 *
 * This method creates meter_reads table in the DB
 *
 * @returns {Promise<void>}
 */
function createTable() {
    return new Promise( (resolve, reject) => {
        db.run('CREATE TABLE meter_reads (cumulative INTEGER, readingDate TEXT, unit TEXT)', (err) =>{
            if(err) {
                reject(err);
            } else {
                resolve();
            }
        });
    } );
}

/**
 * @method PUBLIC
 *
 * This method caches the injected 'dbConnection' object and calls the createTable function to
 * create meter_reads table in DB
 *
 * @param {Object} dbConnection - sqlite3 database connection object
 * @returns {Promise<void>}
 */
function init(dbConnection) {
    db = dbConnection;
    return createTable();
}

/**
 * @method PUBLIC
 *
 * This method returns all the meter reading records from the DB
 *
 * @returns {Promise<[{
 *     cumulative: <number>,
 *     readingDate: <string>,
 *     unit: <string>
 * }]>}
 */
function getAllMetersReadings() {
    return new Promise( (resolve, reject) => {
        db.all("SELECT * FROM meter_reads", function(err, rows) {
            if( err ) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    } );
}

/**
 * @method PUBLIC
 *
 * This method inserts a new meter reading in the database
 *
 * @param {Object} meterReading - meter reading to insert
 * @returns {Promise<void>}
 */
async function insertNewMeterReading( meterReading = {} ) {
    const
        {cumulative, readingDate, unit} = meterReading;

    if( !cumulative || !readingDate || !unit) {
        throw new Error(`'meterReading' must have 'cumulative', 'readingDate' and 'unit' properties`);
    }

    return new Promise( (resolve, reject) => {
                   db.run(
                       'INSERT INTO meter_reads (cumulative, readingDate, unit) VALUES (?, ?, ?)',
                       [cumulative, readingDate, unit],
                       (err) => {
                           if( err ) {
                               reject(err);
                           } else {
                               resolve();
                           }
                       }
                   )
               } );
}

/**
 * @method PUBLIC
 *
 * This method returns all the meter readings in the database
 *
 * @param {Object[]} meterReadings - Meter readings to insert
 * @returns {Promise<void>}
 */
async function insertAllMeterReadings( meterReadings ) {
    if( !meterReadings || !Array.isArray(meterReadings) ) {
        throw new Error(`'meterReadings' must be an array`);
    }

    let
        err;

    for( const meterReading of meterReadings ) {
        [err] = await formatPromiseResult( insertNewMeterReading(meterReading) );

        if( err ) {
            logger.error(`Error while inserting meterReading = ${JSON.stringify(meterReading)}`);
            throw err;
        }
    }
}

module.exports = {
    init,
    insertAllMeterReadings,
    getAllMetersReadings,
    insertNewMeterReading
};