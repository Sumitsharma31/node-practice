const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

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
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const postData = querystring.parse(body);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Received: Name - ${postData.name}, Gender - ${postData.gender}`);
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