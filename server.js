require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const apiRouter = require('./api-router.js');
const staticRouter = require('./static-router.js');

const server = express();

// CORS settings
let corsOptions;
const permissiveCors = process.env.PERMISSIVE_CORS;
if (permissiveCors) {
  corsOptions = {
    origin: true,
    optionsSuccessStatus: 200,
  };
} else {
  corsOptions = {
    origin: [
      'https://rsk.co',
      /\.rsk\.co$/,
      'https://rootstock.io',
      /\.rootstock\.io$/,
      'https://rifos.org',
      /\.rifos\.org$/,
      // temporary ones below, currently used in staging environments
      'https://gatsby-rsk-git-feature-stats-api-zgraya.vercel.app',
      'https://gatsby-rsk-git-wp-zgraya.vercel.app',
    ],
    optionsSuccessStatus: 200,
  };
}
server.use(cors(corsOptions));

// logger middleware
if (process.env.NODE_ENV != 'production') {
  server.use(morgan('dev'));
}

// redirect all requests for https://self-service.rsk.co/
server.all('/', (req, res) => {
  res.status(302).redirect('https://dev.rootstock.io/');
});

// health check
server.get('/api/status', (req, res) => {
  res.send({
    ok: Date.now(),
  });
});

// api router
server.use('/api/v1', apiRouter);

// static directories
server.use(staticRouter);

module.exports = server;
