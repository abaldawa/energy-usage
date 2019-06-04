/**
 * User: abhijit.baldawa
 */

const
    {getRandomIntBetweenRange, getFraction} = require('../../../src/utils/numberUtil');

describe('Module utils/numberUtil.js:', function() {
    describe("#getFraction()", function() {
        it("Should throw an error if no argument is provided", function() {
            getFraction.should.throw(Error, `'noOfDaysUntilMonthEnd' must be a number`);
        });

        it("Should throw an error if input argument is less than 1", function() {
            getFraction.bind(null, 0).should.throw(Error, `'noOfDaysUntilMonthEnd' cannot be less than 1 day`);
        });

        it("For input number between 1 and 10 should return random fraction between 0.1 and 0.35", function() {
            const fraction = getFraction(7);

            fraction.should.be.within(0.1, 0.35);
        });

        it("For input number between 11 and 20 should return random fraction between 0.36 and 0.7", function() {
            const fraction = getFraction(11);

            fraction.should.be.within(0.36, 0.7);
        });

        it("For input number greater than 20 should return random fraction between 0.71 and 0.9", function() {
            const fraction = getFraction(21);

            fraction.should.be.within(0.71, 0.9);
        });
    });

    describe("#getRandomIntBetweenRange()", function() {
        it(`Should throw an error if 'fraction' argument value is not between 0.1 and 0.9`, function() {
            getRandomIntBetweenRange.bind(null, null, null, 1).should.throw(Error, `'fraction must between 0.1 and 0.9'`);
        });

        it(`Should throw an error if 'min' and or 'max' arguments are not passed`, function() {
            getRandomIntBetweenRange.bind(null, null, null, 0.9).should.throw(Error, `'min' and 'max' must be of type number`);
        });

        it(`Should throw an error if 'min' is greater than 'max'`, function() {
            getRandomIntBetweenRange.bind(null, 12, 10, 0.9).should.throw(Error, `'min' should be smaller than 'max'`);
        });

        it(`Should return random value between 'mix' and 'max' for fraction between 0.1 and 0.9`, function() {
            const randomNo = getRandomIntBetweenRange(100, 200, 0.7);

            randomNo.should.be.within(100, 200);
        });
    });
});