const axios = require('axios');
const Check = require('../models/Check');

exports.triggerAlert = (report, checkId) => {
  const savedCheck = await Check.findById(checkId);
  const webhooks = savedCheck.webhooks;
  for (const webhook in webhooks) {
    axios.post(webhook.name, {
      report: report,
    });
  }
};
