const http = require('http');
const fs = require('fs');

// Create an HTTP server
const server = http.createServer((req, res) => {
    let page = 'pages' + req.url + '.html';
    switch (req.url) {
        case '/':
            page = 'pages/main.html';
            break;
        case '/style.css':
        case '/script.js':
        case '/favicon.ico':
            page = req.url.slice(1);
            break;
        default: 
            if (req.url.startsWith('/images/')) page = req.url.slice(1);
    }
    console.log(page);
    fs.readFile(page, function(err, data) {
        if (err) {
            res.writeHead(404);
            res.write('Page not found');
            return res.end();
        }
        res.writeHead(200);
        res.write(data);
        return res.end();
    });
});

// Start the server and listen on port 3000
server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});