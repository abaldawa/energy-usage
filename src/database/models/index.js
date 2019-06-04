/**
 * User: abhijit.baldawa
 *
 * This module initializes all db models
 */

const
    meterReadingsSampleData = require('../sampleData'),
    meterReadsModel = require('./meter_reads.model'),
    logger = require('../../logger/logger'),
    {formatPromiseResult} = require('../../utils/util');

module.exports = async ( dbConnection ) => {
    let
        err;

    // ----------------------- 1. Init meterReader model -------------------------------
    [err] = await formatPromiseResult( meterReadsModel.init(dbConnection) );

    if( err ) {
        logger.error(`Error initializing 'meterReadsModel'. Error: ${err.stack || err}`);
        throw err;
    }
    // -------------------------------- 1. END -----------------------------------------


    // ------------------------------ 2. Populate dummy data in DB via meterReadsModel ----------------------
    [err] = await formatPromiseResult( meterReadsModel.insertAllMeterReadings(meterReadingsSampleData.electricity) );

    if( err ) {
        logger.error(`Error populating 'meter_reads' table with sample data. Error: ${err.stack || err}`);
        throw err;
    }
    // ---------------------------------------------- 2. END --------------------------------------------------
};