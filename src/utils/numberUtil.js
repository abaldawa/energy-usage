/**
 * User: abhijit.baldawa
 *
 * This module contains utility functions for number operations
 */

/**
 * @method PRIVATE
 *
 * This method generates a random number between range max and mix
 *
 * @param {number} min - range start
 * @param {number} max - range end
 * @returns {number} - random number
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * @method PUBLIC
 *
 * This method generates random fraction in between 0.1 and 0.9 based on noOfDaysUntilMonthEnd.
 * The lower the number the lower the fraction and vice versa.
 *
 * @param {number} noOfDaysUntilMonthEnd -
 * @returns {number}
 */
function getFraction( noOfDaysUntilMonthEnd ) {
    // --------------- 1. Validation ------------------------------
    if( typeof noOfDaysUntilMonthEnd !== "number" ) {
        throw new Error(`'noOfDaysUntilMonthEnd' must be a number`);
    }

    if( noOfDaysUntilMonthEnd < 1 ) {
        throw new Error(`'noOfDaysUntilMonthEnd' cannot be less than 1 day`);
    }
    // --------------------- 1. END --------------------------------


    // -------------------- 2. Calculate the fraction ----------------------
    if( 1 <= noOfDaysUntilMonthEnd && noOfDaysUntilMonthEnd <= 10 ) {
        return getRandomArbitrary( 0.1, 0.35 );
    } else if( 11 <= noOfDaysUntilMonthEnd && noOfDaysUntilMonthEnd <= 20 ) {
        return getRandomArbitrary( 0.36, 0.7 );
    } else {
        return getRandomArbitrary( 0.71, 0.9 );
    }
    // ---------------------------- 2. END ----------------------------------
}

/**
 * @method PUBLIC
 *
 * Given the fraction (between 0.1 and 0.9) this method returns a random integer between min and max values.
 * The value is higher than min and is less than (but not equal to) max.
 *
 * @param {number} min - Range start
 * @param {number} max - Range end
 * @param {number} fraction - fraction to use for calculating random number
 *                            Must be between 0.1 and 0.9
 * @returns {number}
 */
function getRandomIntBetweenRange(min, max, fraction) {
    // --------------- 1. Validation ------------------------------
    if( fraction > 0.9 || fraction < 0.1 ) {
        throw new Error(`'fraction must between 0.1 and 0.9'`);
    }

    if( typeof min !== "number" || typeof max !== "number" ) {
        throw new Error(`'min' and 'max' must be of type number`);
    }

    if( min >= max ) {
        throw new Error(`'min' should be smaller than 'max'`);
    }
    // --------------------- 1. END --------------------------------


    // --------------------- 2. Generate random number ---------------
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(fraction * (max - min)) + min;
    // --------------------- 2. END --------------------------------
}

module.exports = {
    getFraction,
    getRandomIntBetweenRange
};
