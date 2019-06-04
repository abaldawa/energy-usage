/**
 * User: abhijit.baldawa
 *
 * This module exposes all the middleware functions used by this server as a object
 */

const
    responseTimeLoggerMiddleware = require('./responseTimeLogger');

module.exports = {
    responseTimeLoggerMiddleware
};
