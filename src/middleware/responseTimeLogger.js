/**
 * User: abhijit.baldawa
 *
 * This middleware module is used to log response time for HTTP calls
 */

const
    logger = require('../logger/logger');

/**
 * @method PUBLIC
 *
 * This method logs the response time for HTTP requests made to the server
 *
 * @param {Object} ctx - koa context object (see: https://koajs.com/#context)
 * @param {function} next - koa function to call next middleware
 * @returns {Promise<void>}
 */
async function logResponseTime( ctx, next ) {
    const start = Date.now();

    await next();

    const rt = Date.now() - start;
    logger.info(`${ctx.status} ${ctx.method} ${ctx.url} - ${rt}ms`);
}

module.exports = logResponseTime;