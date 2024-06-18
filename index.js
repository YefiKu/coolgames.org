const http = require('http');
const fs = require('fs');
// Create an HTTP server
http.createServer((req, res) => {
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
        res.writeHead(200);
        res.write(data);
        return res.end();
    });
}).listen(3000);