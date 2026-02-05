const cookieParser = require('cookie-parser');
const express = require('express');
const bcrypt = require('bcrypt')

const app = express();
app.use(cookieParser())
// cookies code
// app.get('/', (req, res) => {

//   res.cookie('name', "sumit");
//   res.send("cookie saved")

// })
// app.get('/read', (req, res) => {
//   console.log(req.cookies);
//   res.send("sone")

// })

// Bcrypt start from here 

app.get('/', (req, res) => {

  // Technique 1 (generate a salt and hash on separate function calls):
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash('password', salt, function (err, hash) {
      console.log("method 1", hash);
      res.send('done')
    });
  });

  // Technique 2 (auto-gen a salt and hash):
  bcrypt.hash('secret', 10, function (err, hash) {
    console.log("method 2", hash);

  });
})


app.listen(3000, () => {
  console.log("server started")


})