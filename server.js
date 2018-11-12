const express = require('express');
const app = express();

app.use(express.static('public'));
app.listen(process.env.PORT || 8080);


app.get('/', (req, res) => {
  res.render('index.html')
});

app.get('/business', (req, res) => {
  res.render('business.html')
});

app.get('/listings', (req, res) => {
  res.render('listings.html')
});

app.get('/login', (req, res) => {
  res.render('login.html')
});

app.get('/sign-up', (req, res) => {
  res.render('sign-up.html')
});


// function runServer() {
//   const port = process.env.PORT || 8080;
//   return new Promise((resolve, reject) => {
//       server = app
//       .listen(port, () => {
//           console.log(`Your app is listening on port ${port}`);
//           resolve(server);
//       })
//       .on("error", err => {
//           reject(err);
//       });
//   });
// }

// function closeServer() {
//   return new Promise((resolve, reject) => {
//       console.log("Closing server");
//       server.close(err => {
//           if (err) {
//               reject(err);
//               return;
//           }
//           resolve();
//       });
//   });
// }

// if (require.main === module) {
//   runServer().catch(err => console.error(err));
// }

// module.exports = {app, runServer, closeServer};

module.exports = {app};