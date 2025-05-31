const http=require('http');
const port=3000;
const server=http.createServer((req,res)=>{
console.log(req.url ,req.method);
if (req.url==="/") {
 res.writeHead(200,'content-type','text/html');
 res.write("<h1>welcome to home page </h1>")
 res.write(`<a href="/calculator"> go to Calculator </a>`);
 return res.end();
    
}
else if (req.url==='/calculator') {
    res.writeHead(200,'content-type','text/html');
 res.write("<h1>welcome to calculator page </h1>")
 res.write("<form action='/result' method='POST'>");
 res.write("<input type='number' placeholder='enter first number' required />");
 res.write("<input type'number' placeholder='enter second number' required />");
 res.write("<input type='submit' value='submit' />");
 res.write("</form>");

 return res.end();
}
else if (req.url==='/result'&& req.method=='POST') {
    res.writeHead(200,'content-type','text/html');
 res.write("<h1>welcome to result page </h1>")
}
})
server.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`);
    
})