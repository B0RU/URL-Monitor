const Check = require('../models/Check');
const Report = require('../models/Report');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const process = require('process');

exports.getChecks = async (req, res) => {
  const tokenPayload = jwt.verify(
    req.headers['authorization'],
    process.env.TOKEN_SECRET
  );
  const userId = tokenPayload._id;
  const allChecks = await Check.find({ user: userId });
  try {
    if (allChecks.length != 0) {
      res.status(200).json({
        checks: allChecks,
      });
    } else {
      res.status(200).json({
        message: 'User has no checks yet!',
      });
    }
  } catch (error) {
    res.status(400).json({
      message: 'Something Went Wrong!',
      error: error,
    });
  }
};

exports.creatCheck = async (req, res) => {
  const tokenPayload = jwt.verify(
    req.headers['authorization'],
    process.env.TOKEN_SECRET
  );
  const userId = tokenPayload._id;
  const requestPayload = req.body;
  const defaultProbrites = {
    timeout: req.body.timeout || 5000,
    interval: req.body.interval || 600000,
    threshold: req.body.threshold || 1,
    user: userId,
    isPaused: true,
  };

  const check = new Check(Object.assign(requestPayload, defaultProbrites));
  const savedCheck = await check.save();
  try {
    axios.put(`http://localhost:5000/startstop/${savedCheck._id}`, {
      isPaused: false,
    });
    const report = new Report({ check: savedCheck._id, startTime: Date.now() });
    await report.save();
    res.status(201).json({
      message:
        'Check has been Created & Started Successfully!. there is a report has created for the check!',
      check: savedCheck,
    });
  } catch (error) {
    res.status(400).json({
      message: 'check not saved',
      error: error,
    });
  }
};

exports.editCheck = async (req, res) => {
  const updatedCheck = await Check.findByIdAndUpdate(req.params._id, req.body, {
    new: true,
  });
  try {
    res.status(201).json({
      message: 'check Updated Successfully!',
      check: updatedCheck,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Something Went Wrong!',
      error: error,
    });
  }
};

exports.deleteCheck = async (req, res) => {
  const deletedCheck = await Check.findByIdAndDelete(req.params._id);
  if (deletedCheck != null) {
    res.status(200).json({
      message: 'Check Deleted successfully!',
      check: deletedCheck,
    });
  } else {
    res.status(400).json({
      message: 'check not found!',
    });
  }
};
