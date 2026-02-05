const express = require('express');
const cookieParser = require("cookie-parser")
const app = express();


const jwt = require('jsonwebtoken');
let email = 'sumi@gmail.com'

app.use(cookieParser())

app.get('/', (req, res) => {
  let token = jwt.sign({ email: email }, '48frg84');
  console.log(token);
  res.cookie('token', token)
  res.send("token generated")

})
app.get('/read', (req, res) => {
  console.log(req.cookies.token);
  res.send('check console')

})




app.listen(3000)