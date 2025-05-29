const http = require('http');
const fs = require('fs');
const url = require('url');
const { buffer, json } = require('stream/consumers');


const port = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    
    if (req.method === 'GET' && parsedUrl.pathname === '/') {
        // Serve the HTML form
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <form action="/submit" method="post">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required><br>
                
                <label for="gender">Gender:</label>
                <select id="gender" name="gender">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select><br>

                <button type="submit">Submit</button>
            </form>
        `);
    } else if (req.method === 'POST' && parsedUrl.pathname === '/submit') {
        // Handle form submission
        let body = [];
        req.on('data', chunk => {
            console.log(chunk.toString());
           body.push(chunk)
            
        });
        req.on('end', () => {
           const fullBody=Buffer.concat(body).toString()
            const params=new URLSearchParams(fullBody)
            
            // const bodyObj={};
            // for( const [key,value] of params.entries()){
            //     bodyObj[key]=value;
            // }
          const  bodyObj=Object.fromEntries(params)
            console.log(bodyObj);
            
           fs.writeFileSync('user.txt', JSON.stringify(bodyObj))
            
           res.writeHead(302, { Location: '/' });
res.end();
        });
    } else {
        // Handle 404
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

