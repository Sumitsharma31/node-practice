const userDetailHandler=require("./user")
const http=require('http');
const port = 3000;
const server=http.createServer(userDetailHandler)

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
