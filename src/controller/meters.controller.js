/**
 * User: abhijit.baldawa
 *
 * This module exposes controller methods for "/meters" route
 */

const
    moment = require('moment'),
    {isMochaTest} = require('../config/config'),
    {getDaysUntilMonthEnd, isEndOfMonth} = require('../utils/dateUtil'),
    {getFraction, getRandomIntBetweenRange} = require('../utils/numberUtil'),
    {formatPromiseResult} = require('../utils/util');

/**
 * Is configurable for testing
 */
let
    meterReadsModel = require('../database/models/meter_reads.model');

/**
 * MeterRecord structure:
 *
 * @typedef {Object} MeterRecord  - A meter record
 * @property {string} readingDate - ISO date string
 * @property {number} cumulative - meter reading of that date
 * @property {string} unit - meter reading unit
 */

/**
 * MeterReadingRecords structure:
 * @typedef {Array.<MeterRecord>} MeterReadingRecords
 */


/**
 * @method PRIVATE
 *
 *
 * Given the currentMonthReading and nextMonthReading of meters estimates the
 * meter reading for the end of the month as per date currentMonthReading.readingDate
 *
 * @param {MeterRecord} currentMonthReading - The {@link MeterRecord} of current month
 * @param {MeterRecord} nextMonthReading  meter {@link MeterRecord} of next month
 * @returns {{formattedDate: string, cumulative: number}}
 */
function estimateMonthEndReading( currentMonthReading, nextMonthReading ) {
    if( !nextMonthReading ) {
        /**
         * If next month is not present then cannot estimate the month end meter reading
         */
        return;
    }

    const
        {readingDate: currentMonthISODate, cumulative: currentMonthCumulative} = currentMonthReading,
        {readingDate: nextMonthISODate, cumulative: nextMonthCumulative} = nextMonthReading,
        currentMonthReadingDate = moment( currentMonthISODate ),
        nextMonthReadingDate = moment( nextMonthISODate ),
        currentMonthFormattedDate = currentMonthReadingDate.format("MMM-YYYY");

    let
        endOfMonthReading;

    if( isEndOfMonth( currentMonthReadingDate ) ) {
        endOfMonthReading = currentMonthCumulative;
    } else if( currentMonthReadingDate.clone().add(1, "month").format("MMM-YYYY") === nextMonthReadingDate.format("MMM-YYYY") ) {
        /**
         * If nextMonthReadingDate is next month to the currentMonthReadingDate then estimation is possible
         */
        endOfMonthReading = getRandomIntBetweenRange(
                                currentMonthCumulative,
                                nextMonthCumulative,
                                getFraction( getDaysUntilMonthEnd(currentMonthReadingDate) )
                            );
    }

    if( endOfMonthReading ) {
        return {
            cumulative: endOfMonthReading,
            formattedDate: currentMonthFormattedDate
        }
    }
}

/**
 * @method PRIVATE
 *
 * Given the meterReadings records
 *
 * @param {MeterReadingRecords} meterReadings
 * @returns {MeterReadingRecords}
 */
function getMonthlyUsageArray( meterReadings ) {
    let
        lastMonthEndReading,
        monthlyUsageArr = [];

    for( let index = 0; index < meterReadings.length; index++ ) {
        const
            currentMonthEndEstimatedReading = estimateMonthEndReading( meterReadings[index], meterReadings[index+1] );

        if( currentMonthEndEstimatedReading && lastMonthEndReading ) {
            monthlyUsageArr.push({
                cumulative: currentMonthEndEstimatedReading.cumulative - lastMonthEndReading.cumulative,
                readingDate: currentMonthEndEstimatedReading.formattedDate,
                unit: meterReadings[index].unit
            });
        }

        lastMonthEndReading = currentMonthEndEstimatedReading;
    }

    return monthlyUsageArr;
}

/**
 * @method PUBLIC
 *
 * For route: GET "/meters"
 *
 * This method returns all the meter reading from the database
 *
 * Response structure:
 * [
 *    {
 *        cumulative: <Number>,
 *        readingDate: <String>,
 *        unit: <String>
 *    },
 *    ...
 * ]
 *
 * @param {Object} ctx - koa context object (see: https://koajs.com/#context)
 * @returns {Promise<void>}
 */
async function getAllMetersReadings( ctx ) {
    let
        err,
        meterReadings;

    [err, meterReadings] = await formatPromiseResult( meterReadsModel.getAllMetersReadings() );

    if( err ) {
        logger.error(`Error while reading meter readings from the DB. Error: ${err.stack || err}`);
        return ctx.throw(500, err);
    }

    ctx.body = meterReadings;
}

/**
 * @method PUBLIC
 *
 * For route: POST "/meters"
 *
 * This method inserts a new meter reading in the database.
 * If successful then responds as "Inserted"
 *
 * @param {Object} ctx  koa context object (see: https://koajs.com/#context)
 * @param {Object} ctx.request  koa request object
 * @param {Object} ctx.request.body  meter reading object to insert
 * @param {Number}  ctx.request.body.cumulative  meter reading in kWh
 * @param {String} ctx.request.body.readingDate  meter reading date in ISO string format
 * @returns {Promise<void>}
 */
async function createNewMeterReading( ctx ) {
    const
        {body: meterReading = {}} = ctx.request,
        {cumulative, readingDate} = meterReading,
        meterDate = moment( readingDate, moment.ISO_8601, true);

    let
        err;

    if( !cumulative || typeof cumulative !== "number" ) {
        return ctx.throw(400, `'cumulative' must be number`);
    } else if( !meterDate.isValid() ) {
        return ctx.throw(400, `'readingDate' must be a valid ISO date string`);
    }

    [err] = await formatPromiseResult(
                    meterReadsModel.insertNewMeterReading( {
                        cumulative,
                        readingDate: meterDate.toISOString(),
                        unit: "kWh"
                    } )
                  );

    if( err ) {
        logger.error(`Error while inserting meter readings into the DB. Error: ${err.stack || err}`);
        return ctx.throw(500, err);
    }

    ctx.body = "Inserted";
}

/**
 * @method PUBLIC
 *
 * For route: GET "/meters/monthlyUsage"
 *
 * This method calculates and returns the monthly energy usage based on the available meter readings in the
 * database.
 *
 * Response structure:
 * [
 *    {
 *        cumulative: <Number>,
 *        readingDate: <String, Ex = "Apr-2018">,
 *        unit: <String>
 *    },
 *    ...
 * ]
 *
 * @param ctx
 * @returns {Promise<*>}
 */
async function getMonthlyUsage( ctx ) {
    let
        err,
        meterReadings;

    [err, meterReadings] = await formatPromiseResult( meterReadsModel.getAllMetersReadings() );

    if( err ) {
        logger.error(`Error while reading meter readings from the DB. Error: ${err.stack || err}`);
        return ctx.throw(500, err);
    }

    ctx.body = getMonthlyUsageArray(meterReadings);
}

module.exports = {
    getAllMetersReadings,
    createNewMeterReading,
    getMonthlyUsage
};

// NOTE: Expose below private methods only in test environment for testing
if( isMochaTest() ) {
    module.exports.estimateMonthEndReading = estimateMonthEndReading;
    module.exports.getMonthlyUsageArray = getMonthlyUsageArray;

    /**
     * This is necessary for testing so that a mock of model methods can be passed. The reason for this is because
     * model methods are already unit tested and for unit testing controller methods we can only focus on controller
     * methods and model methods can return perform a dummy operation.
     * @param {Object} model - a dummy model object
     */
    module.exports.setMeterReadingModel = function( model ) {
        meterReadsModel = model;
    }
}

