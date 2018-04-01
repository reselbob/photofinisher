"use strict";
module.exports.done = function done(args){
    console.log(`Finished processing: ${JSON.stringify(args)}`)
}

module.exports.falie = function fail(args){
    console.error(`FAILED processing: ${JSON.stringify(args)}`)
}

module.exports.functionName = 'handler';
module.exports.invokedFunctionArn = 'arn:aws:lambda:us-east-1:950922144292:function:photoFinisherDispatcherMock';