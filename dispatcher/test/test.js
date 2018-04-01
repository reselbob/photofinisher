'use strict';
const chai = require('chai');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;
const mockEvent = require('../../mocks/mockEvent');
const context = require('../../mocks/mockContext');
const handler = require('../index');
const dispatcher = require('../../dispatcher/dispatcher');

describe('Basic Tests: ', () => {
    it('Can send message to photoFinisherTopics', function (done) {
        const event = mockEvent.getEvent();
        event.sourceUrl = 'https://pbs.twimg.com/profile_images/1254198539/wileE-cyote.jpg';
        event.targetUrl = 'https://us-central1-serverlessdesign.cloudfunctions.net/PhotoFinisherHandler';
        dispatcher.handler(event, context, (err, data) => {
            if (err) {
                console.error(err)
                done(err);
            } else {
                console.log(data);
                done();
            }

        });
    })
});