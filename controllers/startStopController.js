const axios = require('axios');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const Check = require('../models/Check');
const Report = require('../models/Report');
const webhooks = require('../utils/triggerWebhook');
const sendMail = require('../utils/nodemailerSetup');
this.pollingInterval = null;
this.startDownTime = 0;
this.endDownTime = 0;
this.totalDownTime = 0;
this.totalUpTime = 0;
this.availability = 0;

exports.startStop = async (req, res) => {
  await Check.findByIdAndUpdate(req.params._id, {
    isPaused: req.body.isPaused,
  });
  const check = await Check.findById(req.params._id);
  const report = await Report.findOne({ check: check._id });

  let sumResponseTime = 0;
  let count = 1;
  let averageResponseTime = 0;
  eventEmitter.once('down', (time) => {
    this.startDownTime = time;
    const totalOutages = report.outages + 1;
    Report.findOneAndUpdate(
      { check: check._id },
      {
        outages: totalOutages,
      },
      { new: true }
    ).then((response) => {
      webhooks.triggerAlert(response, check._id);
      sendMail.sendMail(report);
    });
  });
  eventEmitter.once('up', (time) => {
    if (this.startDownTime == 0) {
      this.endDownTime = 0;
    } else {
      this.endDownTime = time;
    }
  });

  if (check != null) {
    if (check.isPaused == false) {
      if (check.createdAt !== check.updatedAt) {
        res.json({
          message: 'Check Started!',
        });
      }
      const startCheck = () => {
        axios.interceptors.request.use(
          function (config) {
            config.metadata = { startTime: new Date() };
            return config;
          },
          function (error) {
            return Promise.reject(error);
          }
        );

        axios.interceptors.response.use(
          function (response) {
            response.config.metadata.endTime = new Date();
            response.duration =
              response.config.metadata.endTime -
              response.config.metadata.startTime;
            return response;
          },
          function (error) {
            error.config.metadata.endTime = new Date();
            error.duration =
              error.config.metadata.endTime - error.config.metadata.startTime;
            return Promise.reject(error);
          }
        );
        axios({
          method: 'GET',
          url: check.protocol + '://' + check.url,
          timeout: check.timeout,
          headers: check.headers || null,
          port: check.port || null,
          auth: check.authentication || null,
        })
          .then((response) => {
            if (response.statusText !== 'OK') {
              eventEmitter.emit('down', Date.now());
            } else {
              eventEmitter.emit('up', Date.now());
            }

            const responseTime = response.headers['x-response-time']
              ? +response.headers['x-response-time']
              : response.duration;
            sumResponseTime += responseTime;
            averageResponseTime = sumResponseTime / count++;
            this.totalDownTime =
              (this.totalDownTime + (this.endDownTime - this.startDownTime)) /
              1000;
            this.totalUpTime =
              (Date.now() - report.startTime - this.totalDownTime) / 1000;
            this.availability = Math.floor(
              ((this.totalUpTime - this.totalDownTime) /
                ((Date.now() - report.startTime) / 1000)) *
                100
            );
            console.log(averageResponseTime);
            Report.findOneAndUpdate(
              { check: check._id },
              {
                responseTime: averageResponseTime,
                status: response.statusText,
                downtime: this.totalDownTime,
                uptime: this.totalUpTime,
                availability: this.availability,
              },
              {
                new: true,
              }
            ).then((response) => {
              console.log(response.status);
            });
          })
          .catch((err) => {
            console.log(err);
            res.json({
              message: 'Something Went Wrong!',
            });
          });
        this.pollingInterval = setTimeout(startCheck, check.interval);
      };
      startCheck();
    } else {
      clearTimeout(this.pollingInterval);
      eventEmitter.removeAllListeners();
      res.json({
        message: 'Check Stopped!',
      });
    }
  } else {
    res.status(404).json({
      message: 'Check Not Found',
    });
  }
};
