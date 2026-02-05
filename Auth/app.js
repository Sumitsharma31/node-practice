const cookieParser = require('cookie-parser');
const express = require('express');

const app = express();
app.use(cookieParser())

app.get('/', (req, res) => {

  res.cookie('name', "sumit");
  res.send("cookie saved")

})
app.get('/read', (req, res) => {
  console.log(req.cookies.name);
  res.send("sone")

})
app.listen(3000, () => {
  console.log("server started")


})