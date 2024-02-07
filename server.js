const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const EventEmitter = require('events');
class Emitter extends EventEmitter {}
const myEmitter = new Emitter();

const PORT = process.env.PORT || 3500;

const logEvents = require('./npm/logEvents');
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName));

const serveFile = async (filePath2, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(filePath2, !contentType.includes('image') ? 'utf8' : '');
        const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData;
        response.writeHead(filePath2.includes('404') ? 404 : 200, { 'Content-Type': contentType });
        response.end(contentType === 'application/json' ? JSON.stringify(data) : data);
    } catch (error) {
        console.log(error);
        myEmitter.emit('log', `${error.name}\t ${error.message}`, 'errLog.txt');
        response.statusCode = 500;
        response.end();
    }
};

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.method}\t ${req.url}`, 'reqLog.txt');

    const extention = path.extname(req.url);

    let contentType;

    switch (extention) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    let filePath =
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
            ? path.join(__dirname, 'views', req.url, 'index.html')
            : contentType === 'text/html'
            ? path.join(__dirname, 'views', req.url)
            : path.join(__dirname, req.url);

    // makes .html extension not required in the browser
    if (!extention && req.url.slice(-1) !== '/') filePath += '.html';

    const fileExists = fs.existsSync(filePath);

    if (fileExists) {
        serveFile(filePath, contentType, res);
    } else {
        switch (path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, { Location: '/new-page.html' });
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, { Location: '/' });
                res.end();
                break;
            default:
                // 404
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
                break;
        }
    }
});
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
