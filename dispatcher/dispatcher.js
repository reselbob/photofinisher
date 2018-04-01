"use strict";
const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');

function formatEnvVarError(correlationId, environmentVar){
  const obj = {
      correlationId: correlationId,
      message: `Missing environment variable: ${environmentVar})`
    }
    return obj;
}

function formatEventPropertyError(correlationId, eventProperty){
    const obj = {
        correlationId: correlationId,
        message: `Missing event property: ${eventProperty})`
    }
    return obj;
}

exports.handler = (event, context, callback) => {
    if(process.env.LOCAL){
        const config = require('./config');
        const awsConfig = config.awsSns;
        AWS.config.update(awsConfig);
    }

    const correlationId = event.correlationId || uuidv1();
    if(!process.env.PHOTO_FINISHER_TOPIC){
        const err = formatEnvVarError(correlationId, 'PHOTO_FINISHER_TOPIC')
        console.error(JSON.stringify(err));
        callback(new Error(JSON.stringify(err)));
    }

    if(!event.targetUrl){
        const err = formatEventPropertyError(correlationId, 'event.targetUrl')
        console.error(JSON.stringify(err));
        callback(new Error(JSON.stringify(err)));
    }

    if(!event.sourceUrl){
        const err = formatEventPropertyError(correlationId, 'event.sourceUrl')
        console.error(JSON.stringify(err));
        callback(new Error(JSON.stringify(err)));
    }


    console.log({correlationId: correlationId, message:"Starting Event", event: event});
    const msg = {
        correlationId: correlationId,
        excutingFunction: context.invokedFunctionArn,
        targetUrl: event.targetUrl,
        sourceUrl: event.sourceUrl
    };
    var sns = new AWS.SNS();
    sns.publish({
        TopicArn: process.env.PHOTO_FINISHER_TOPIC,
        Subject: "From PhotoFinisherDispatcher",
        Message: JSON.stringify(msg)
    }, function(err, data) {
        if(err) {
            console.error('error publishing to SNS');
            context.fail(err);
        } else {
            console.info('message published to SNS');
            context.done(null, data);
        }
        callback(err, 'Message Sent' + JSON.stringify(msg));
    });
};