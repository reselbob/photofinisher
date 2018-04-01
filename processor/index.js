exports.handler = (event, context, callback) => {
    "use strict";
    const Jimp = require("jimp");
    const request = require('request');
    const uuidv1 = require('uuid/v1');
    if (!event.sourceUrl || !event.targetUrl) {
        const err = {message: 'Invalid event', event: event};
        console.error(err);
        callback(err);
        return;
    }
        Jimp.read(event.sourceUrl)
            .then(photo => {
                const filename = 'bw-' + event.sourceUrl.split('/').pop();
                photo.greyscale()
                    .getBase64(Jimp.MIME_JPEG, (err, rslt) => {
                        if (err) {
                            console.error(err);
                            callback(err);
                        }
                        const correlationId = event.correlationId || uuidv1();
                        const obj = {
                            correlationId: correlationId,
                            sender: "photofinisher",
                            filename: filename,
                            base64: rslt
                        };
                        console.log(JSON.stringify({postingData: obj}));
                        const config = {
                            url: event.targetUrl,
                            method: "POST",
                            json: true,
                            headers: {'x-correlation-id': correlationId},
                            body: obj
                        };
                        console.log(JSON.stringify({configuration: {sending: config}}));
                        request(config, function (err, response, body) {
                            if (err) console.error(err);
                            if (response) console.log(response.body);
                            callback(null, response.body);
                        });

                    });

            }).catch(function (err) {
            console.error(err);
            callback(err);
        });
    };