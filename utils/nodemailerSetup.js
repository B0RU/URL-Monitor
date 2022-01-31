const nodemailer = require('nodemailer');
//Nodemailer setup
const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '7a751885a5eb44',
    pass: '60b6bedb66e69d',
  },
});

exports.sendMail = (report) => {
  transport.sendMail(
    {
      from: 'somemail@gmail.com', // Sender address
      to: 'to emailId', // recipients
      subject: 'changes happend on you server', // Subject line
      text: report, // Plain text body
    },
    function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log('mail has sent.');
        console.log(info);
      }
    }
  );
};
