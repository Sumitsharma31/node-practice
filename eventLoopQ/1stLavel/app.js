const express = require("express")

const app = express()

app.get('/', (req, res) => {
  console.log(req.method);



})
app.get("/test", (req, res) => {
  console.log("Start");

  setTimeout(() => {
    console.log("setTimeout");
  }, 0);

  Promise.resolve().then(() => {
    console.log("Promise");
  });

  console.log("End");

  res.send("Check console");
});
app.listen(3000, () => {
  console.log("node server started");

})