const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();

mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(morgan('common'));
app.use(express.json());

const {DATABASE_URL, PORT} = require('./config');

const postRouter = require('./postRouter');

app.use('/posts', postRouter);

app.use('*', (req, res) => {
  return res.status(404).json({message: 'Not Found'});
});

let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
      server = app
      .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve(server);
      })
      .on("error", err => {
          reject(err);
      });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
          if (err) {
              reject(err);
              return;
          }
          resolve();
      });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };