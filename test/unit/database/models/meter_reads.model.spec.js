/**
 * User: abhijit.baldawa
 */

const
    {formatPromiseResult} = require('../../../../src/utils/util'),
    database = require('../../../../src/database/dbConnection'),
    meterReadsModel = require('../../../../src/database/models/meter_reads.model');

describe('Module database/models/meter_reads.model.js:', function() {
    let
        err,
        dbConnection;

    before(async function () {
        [err, dbConnection] = await formatPromiseResult( database.createConnection() );

        if( err ) {
            console.error(`Failed to connect to SQLite database. Error: ${err.stack || err}`);
            throw err;
        }
    });

    after( function(done) {
        dbConnection.close(done);
    } );

    it("check if database connection is successful", function() {
        should.exist(dbConnection);
    });

    describe("#init()", function() {
        it("should successfully initialize meterReads model", async function() {
            [err] = await formatPromiseResult( meterReadsModel.init(dbConnection) );

            should.not.exist(err);
        });
    });

    describe("#insertNewMeterReading()", function() {
        it("should throw error if no meterReading is provided", async function() {
            [err] = await formatPromiseResult( meterReadsModel.insertNewMeterReading() );

            should.exist(err);
            err.should.be.an("error");
            err.message.should.equal(`'meterReading' must have 'cumulative', 'readingDate' and 'unit' properties`);
        });

        it("should successfully insert a valid meter reading in the database", async function() {
            [err] = await formatPromiseResult(
                            meterReadsModel.insertNewMeterReading({
                                cumulative: 17580,
                                readingDate: "2017-03-28T00:00:00.000Z",
                                unit: "kWh"
                            })
                         );

            should.not.exist(err);
        });
    });

    describe("#insertAllMeterReadings()", function() {
        it("should successfully insert all meter readings in the database", async function() {
            const
                meterReadings = [
                    {
                        cumulative: 17759,
                        readingDate: "2017-04-15T00:00:00.000Z",
                        unit: "kWh"
                    },
                    {
                        cumulative: 18002,
                        readingDate: "2017-05-08T00:00:00.000Z",
                        unit: "kWh"
                    }
                ];

            [err] = await formatPromiseResult( meterReadsModel.insertAllMeterReadings(meterReadings) );

            should.not.exist(err);
        });
    });

    describe("#getAllMetersReadings()", function() {
        it("should successfully retrive all meter readings from the database", async function() {
           let
               meterReadings;

            [err, meterReadings] = await formatPromiseResult( meterReadsModel.getAllMetersReadings() );

            should.not.exist(err);
            should.exist(meterReadings);
            meterReadings.should.be.an("array");
            meterReadings.should.have.lengthOf( 3 );
        });
    });
});