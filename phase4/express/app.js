const express = require("express");
const app = express()

const PORT = 3001;
app.listen(PORT, (res, req) => {
  console.log(`server running on address http://localhost:${PORT}`);



})