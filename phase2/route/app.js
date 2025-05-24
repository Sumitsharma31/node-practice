const http = require('http');
const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    if (req.url == '/home') {
        res.setHeader('content-type', 'text/html');
        res.write('<h1>this is home page</h1>');
        return res.end();

    } else if (req.url == '/men') {
        res.setHeader('content-type', 'text/html');
        res.write('<h1>this is men page</h1>');
        return res.end();
    } else if (req.url == '/women') {
        res.setHeader('content-type', 'text/html');
        res.write('<h1>this is women page</h1>');
        return res.end();
    } else if (req.url == '/kids') {
        res.setHeader('content-type', 'text/html');
        res.write('<h1>this is kids page</h1>');
        return res.end();
    } else if (req.url == '/cart') {
        res.setHeader('content-type', 'text/html');
        res.write('<h1>this is cart page</h1>');
        return res.end();
    }
    else {
        res.setHeader('content-type', 'text/html');
        res.write(`<body>
    <nav>
        <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/men">Men</a></li>
            <li><a href="/women">Women</a></li>
            <li><a href="/kids">Kids</a></li>
            <li><a href="/cart">Cart</a></li>
        </ul>
    </nav>
</body>`)

    }
})


server.listen(3000, () => {
    console.log('server running on http//localhost:3000');

})