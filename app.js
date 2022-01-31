const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
//Import Routes
const authRoutes = require('./routes/auth.js');
const checksRoutes = require('./routes/checks.js');
const reportRoute = require('./routes/reports');
const startStop = require('./routes/startStop');
const process = require('process');
const app = express();
dotenv.config();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

//Route Middlewares
app.use('/api/user', authRoutes);
app.use('/api/check', checksRoutes);
app.use('/api/report', reportRoute);
app.use('/startstop', startStop);

//database connection
mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Up and Running on port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
