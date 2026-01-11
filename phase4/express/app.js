const express = require("express");
const app = express();
const PORT = 3001;

app.use((req, res, next) => {
  console.log("First middleware:", req.url, req.method);
  // res.send('<h1>Hello and welcome in first middleware</h1>');
  next()
});
// app.use((req, res, next) => {
//   console.log("First middleware:", req.url, req.method);
//   res.send('<h1>Hello and welcome in second middleware</h1>');
// });
app.get("/contact-us", (req, res, next) => {
  console.log("form-page", req.url, req.method);
  
  res.send(`
    <form action="/contact-us">
          <input type="text" name="name" placeHolder="Name Please" />
          <input type="text" name="email" placeHolder="Email Please" />
          <input type="submit"  />
    </form>
    
    `);
  app.post("/contact-us", (req, res, next) => {
    console.log("form-filled", req.url, req.method);
    res.send(`Nice you did it`);

  })

})

app.listen(PORT, () => {
  console.log(`Server running on address http://localhost:${PORT}`);
});
