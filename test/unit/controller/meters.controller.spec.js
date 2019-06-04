/**
 * User: abhijit.baldawa
 */

const
    metersController = require('../../../src/controller/meters.controller');

describe("module controller/meters.controller.js", function() {
   describe("#estimateMonthEndReading()", function() {
       it("should not estimate month end reading if next month reading is not present", function() {
           const estimatedMonthEndReading = metersController.estimateMonthEndReading();

           should.not.exist(estimatedMonthEndReading);
       });

       it("If currentMonthReading is already end of the month then the estimated reading should be same as currentMonthReading.cumulative", function() {
           const
               currentMonthReading = {
                   cumulative: 17580,
                   readingDate: "2017-03-31T00:00:00.000Z",
                   unit: "kWh"
               },
               nextMonthReading = {
                   cumulative: 17759,
                   readingDate: "2017-04-15T00:00:00.000Z",
                   unit: "kWh"
               };
           const estimatedMonthEndReading = metersController.estimateMonthEndReading( currentMonthReading, nextMonthReading );

           should.exist(estimatedMonthEndReading);
           estimatedMonthEndReading.should.be.an("object");
           estimatedMonthEndReading.should.have.all.keys("cumulative", "formattedDate");
           estimatedMonthEndReading.cumulative.should.be.an("number");
           estimatedMonthEndReading.cumulative.should.equal(17580);
           estimatedMonthEndReading.formattedDate.should.be.an("string");
           estimatedMonthEndReading.formattedDate.should.have.lengthOf(8);
       });

       it(`should not estimate month end reading if 'nextMonthReading' is not the reading of next month of 'currentMonthReading'`, function() {
           const
               currentMonthReading = {
                   cumulative: 17580,
                   readingDate: "2017-03-30T00:00:00.000Z",
                   unit: "kWh"
               },
               nextMonthReading = {
                   cumulative: 17759,
                   readingDate: "2017-06-15T00:00:00.000Z",
                   unit: "kWh"
               };

           const estimatedMonthEndReading = metersController.estimateMonthEndReading(currentMonthReading, nextMonthReading);

           should.not.exist(estimatedMonthEndReading);
       });

       it(`should estimate month end reading for cumulative value between currentMonthReading.cumulative and nextMonthReading.cumulative for correct inputs`, function() {
           const
               currentMonthReading = {
                   cumulative: 17580,
                   readingDate: "2017-03-20T00:00:00.000Z",
                   unit: "kWh"
               },
               nextMonthReading = {
                   cumulative: 17759,
                   readingDate: "2017-04-15T00:00:00.000Z",
                   unit: "kWh"
               };

           const estimatedMonthEndReading = metersController.estimateMonthEndReading(currentMonthReading, nextMonthReading);

           should.exist(estimatedMonthEndReading);
           estimatedMonthEndReading.should.be.an("object");
           estimatedMonthEndReading.should.have.all.keys("cumulative", "formattedDate");
           estimatedMonthEndReading.cumulative.should.be.an("number");
           estimatedMonthEndReading.cumulative.should.be.within(17580, 17759);
           estimatedMonthEndReading.formattedDate.should.be.an("string");
           estimatedMonthEndReading.formattedDate.should.have.lengthOf(8);
       });
   });

   describe("#getMonthlyUsageArray()", function() {
       it("Should not estimate meter reading at the edges of dataset", function() {
           const
               meterReadings = [
                   {
                       cumulative: 17580,
                       readingDate: "2017-03-28T00:00:00.000Z",
                       unit: "kWh"
                   },
                   {
                       cumulative: 17759,
                       readingDate: "2017-04-15T00:00:00.000Z",
                       unit: "kWh"
                   }
               ];

           const estimatedMeterReadings = metersController.getMonthlyUsageArray(meterReadings);

           should.exist(estimatedMeterReadings);
           estimatedMeterReadings.should.be.an("array");
           estimatedMeterReadings.length.should.equal(0);
       });

       it("Given 'meterReadings' array should correctly estimate monthly usage", function() {
           const
               meterReadings = [
                   {
                       cumulative: 17580,
                       readingDate: "2017-03-28T00:00:00.000Z",
                       unit: "kWh"
                   },
                   {
                       cumulative: 17759,
                       readingDate: "2017-04-15T00:00:00.000Z",
                       unit: "kWh"
                   },
                   {
                       cumulative: 18002,
                       readingDate: "2017-05-08T00:00:00.000Z",
                       unit: "kWh"
                   },
                   {
                       cumulative: 18270,
                       readingDate: "2017-06-18T00:00:00.000Z",
                       unit: "kWh"
                   },
               ];

           const estimatedMeterReadings = metersController.getMonthlyUsageArray(meterReadings);

           should.exist(estimatedMeterReadings);
           estimatedMeterReadings.should.be.an("array");
           estimatedMeterReadings.length.should.equal(2);

           for( const estimatedReading of estimatedMeterReadings ) {
               estimatedReading.should.have.all.keys("cumulative", "readingDate", "unit");
               estimatedReading.cumulative.should.be.an("number");
               estimatedReading.readingDate.should.be.an("string");
               estimatedReading.readingDate.should.have.lengthOf(8);
               estimatedReading.unit.should.be.an("string");
           }
       });
   });
});
