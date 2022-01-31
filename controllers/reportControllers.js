const Report = require('../models/Report');

exports.getReports = async (req, res) => {
  try {
    const report = await Report.findOne({ check: req.params.checkId });
    res.status(200).json({
      report: report,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Something Went Wrong!',
    });
  }
};
