/**
 * User: abhijit.baldawa
 *
 * This module contains utility functions for date
 */

const
    moment = require('moment');

/**
 * Check whether a moment object is the end of the month.
 * Ignore the time part.
 * @param {moment} mmt
 */
function isEndOfMonth(mmt) {
    // startOf allows to ignore the time component
    // we call moment(mmt) because startOf and endOf mutate the momentj object.
    return moment
        .utc(mmt)
        .startOf('day')
        .isSame(
            moment
                .utc(mmt)
                .endOf('month')
                .startOf('day'),
        );
}

/**
 * Returns the difference between two moment objects in number of days.
 * @param {moment} mmt1
 * @param {moment} mmt2
 */
function getDiffInDays(mmt1, mmt2) {
    return mmt1.diff(mmt2, 'days');
}

/**
 * Return the number of days between the given moment object
 * and the end of the month of this moment object.
 * @param {moment} mmt
 */
function getDaysUntilMonthEnd(mmt) {
    return getDiffInDays(moment.utc(mmt).endOf('month'), mmt);
}

module.exports = {
    isEndOfMonth,
    getDaysUntilMonthEnd
};