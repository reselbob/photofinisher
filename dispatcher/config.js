'use strict';
module.exports = (function () {
  const configuration = {
    awsSns: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    }
  };

  const errs = [];

  function traveseNodeSync(node) {
    for (let prop in node) {
      if (typeof node[prop] === 'object' && node[prop]) {
        traveseNodeSync(node[prop]);
      } else {
        if (typeof node[prop] === 'undefined') errs.push(`Missing required value for property ${prop}`);
      }
    }
  }

  function checkForErrors() {
    traveseNodeSync(configuration);
  }
  checkForErrors();

  if (errs.length > 0) throw new Error(errs);

  return configuration;
})();
