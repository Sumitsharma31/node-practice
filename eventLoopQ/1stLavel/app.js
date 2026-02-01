const express = require("express")

const app = express()

app.get('/', (req, res) => {
  console.log(req.method);



})
app.listen(3000, () => {
  console.log("node server started");

})