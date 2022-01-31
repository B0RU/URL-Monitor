const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  userLoginValidation,
  userRegisterValidation,
} = require('../utils/validation');
const process = require('process');

exports.registerUser = async (req, res) => {
  const { error } = userRegisterValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  //checking if email exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).json({ message: 'email is already in use!' });

  //Password Hashing
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create New User
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    await user.save();
    res.status(201).json({
      message: 'User Created Successfully!',
    });
  } catch (error) {
    res.status(500).json({
      message: "Something Went Wrong! User hasn't been Created",
      error: error,
    });
  }
};

//login
exports.login = async (req, res) => {
  //login validation
  const { error } = userLoginValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  //checking if email not exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (!emailExist)
    return res.status(401).json({ message: 'Email does not exist!' });
  //chack password validation
  const validPassword = await bcrypt.compare(
    req.body.password,
    emailExist.password
  );
  if (!validPassword)
    return res.status(401).json({ message: 'Email or password incorrect!' });

  //create token
  const token = jwt.sign({ _id: emailExist._id }, process.env.TOKEN_SECRET);
  res.header('Authorization', token).json({
    token,
  });
};
