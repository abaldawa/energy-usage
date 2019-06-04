## Author: Abhijit Baldawa

## energy-usage
A backend Node.js server to manage monthly meter reading 

## How to run:
1. git clone project
2. npm i
3. npm start -> this will start the server on port 3000 

### NOTE: Port is configurable by setting PORT value in environment variable or can be configured under {project}/src/config/servirConfig.json under httpServer key

To run the unit tests run below:
npm run unitTests (23 unit tests are written)


## Below REST endpoints are exposed:
1. GET /meters -> Fetches all the meter readings from the server
2. POST /meters -> creates a new meter reading in the database
3. GET /meters/monthlyUsage -> calculates and returns an array of monthly usage meter readings

## Points to note:
1. I have developed this application in Javascript (not typescript) because I don't use typescript (even though I know the basics and should be able to pick it up).
2. The latest ECMA script syntax is used and everything is build on the latest version of Node.js (12.4.0)
3. I have designed coding patterns and although the entire code is completely documented with Jsdocs and comments, below approach is designed by me for usages of async/await.

```javascript
// Problem: Cannot handle precise error
async function test() {
    try{
        let res1 = await asyncOperation1();
        
        if(res1) {
          //...
        }
        
        let res2 = await asyncOperation1();
        
        if(res2) {
          //...
        }
        
        let res3 = await asyncOperation1();
        
        if(res3) {
          //...
        }
        
        
        let res4 = await asyncOperation1();
        
        if(res4) {
          //...
        }
        
    } catch(e) {
        console.log(`I do not know which operation threw an error but for logging and also on UI i want to show user exactly what went wrong`, e);
    }
}

// Solution I have used using ES6 array destructuring. 
// Note: Also got rid of try/catch though it can still be present if required to catch some 
// unexpected error in the user code (not async operation) but not necessary.
async function test() {
    let
        err,
        result1,
        result2,
        result3,
        result4;

    [err, result1] = await formatPromiseResult( asyncOperation1() );
    
    if( err ) {
        // I have a chance to handle this precise error
        console.error(`asyncOperation1 failed because: ${err.stack || err}`);
        throw err; // I can also customise the precise error message if this is a controller method
    }

    [err, result2] = await formatPromiseResult( asyncOperation2() );

    if( err ) {
        // I have a chance to handle this precise error
        console.error(`asyncOperation2 failed because: ${err.stack || err}`);
        throw err;
    }

    [err, result3] = await formatPromiseResult( asyncOperation3() );

    if( err ) {
        // I have a chance to handle this precise error
        console.error(`asyncOperation3 failed because: ${err.stack || err}`);
        throw err;
    }

    [err, result4] = await formatPromiseResult( asyncOperation4() );

    if( err ) {
       // I have a chance to handle this precise error
        console.error(`asyncOperation4 failed because: ${err.stack || err}`);
        throw err;
    }
    
    return "some result";
}

// This is a utility function and can be imported from all the modules
function formatPromiseResult( prom ) {
    return prom
            .then((result) => {
                return [null, result];
            })
            .catch( (err) => {
                return [err];
            } );
}

```
