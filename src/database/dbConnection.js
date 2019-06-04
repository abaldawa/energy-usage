/**
 * User: abhijit.baldawa
 *
 * This module exposes method which can be used to initiate connection to sqlite3 database
 */

const
    SQLite = require('sqlite3').verbose();

/**
 * @method PUBLIC
 *
 * This method creates a database connection to the SQLite database.
 * If successful then promise resolves with a database connection object
 * else rejects with error.
 *
 * @returns {Promise<Object>} - If successful resolves with database connection object
 *                              @see https://github.com/mapbox/node-sqlite3/wiki/API#new-sqlite3databasefilename-mode-callback
 */
function createConnection() {
    const connection = new SQLite.Database(':memory:');

   return new Promise( (resolve, reject) => {
       connection
           .on('error', reject)
           .on('open', () => {
               resolve(connection)
           });
   } );
}

module.exports = {
    createConnection
};