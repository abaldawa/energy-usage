/**
 * User: abhijit.baldawa
 */

const
    {formatPromiseResult} = require('../../../src/utils/util');

describe('Module utils/util.js:', function() {
    describe("#formatPromiseResult()", function() {
        it("For rejected promise, should resolve successfully to array containing 1 element which would be error from passed in promise", async function() {
            const outputArr = await formatPromiseResult(
                                        new Promise((resolve, reject) => {
                                            setTimeout(reject, 10, "PROMISE_ERROR");
                                        })
                                    );

            should.exist(outputArr);
            outputArr.should.be.an('array');
            outputArr.should.have.lengthOf(1);
            outputArr[0].should.equal("PROMISE_ERROR");
        });

        it("For successful promise, should resolve successfully to array containing 2 elements. First element should be null and second element should be result of passed in promise", async function() {
            const outputArr = await formatPromiseResult(
                                        new Promise((resolve, reject) => {
                                            setTimeout(resolve, 10, "PROMISE_RESPONSE");
                                        })
                                    );

            should.exist(outputArr);
            outputArr.should.be.an('array');
            outputArr.should.have.lengthOf(2);
            should.equal(outputArr[0], null);
            should.exist(outputArr[1]);
            outputArr[1].should.equal("PROMISE_RESPONSE");
        })
    });
});