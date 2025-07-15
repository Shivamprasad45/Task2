const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile('message.txt', 'utf-8', (err, fileData) => {
      const messages = fileData
        ? fileData.trim().split('\n').reverse().map(msg => `<li>${msg}</li>`).join('')
        : '';

      const html = `
        <html>
          <head><title>Messages</title></head>
          <body>
            <h2>Messages:</h2>
            <ul>${messages}</ul>
            <form action="/message" method="POST">
              <input type="text" name="message" required placeholder="Enter your message" />
              <button type="submit">Send</button>
            </form>
          </body>
        </html>
      `;
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    });

  } else if (req.url === '/message' && req.method === 'POST') {
    const body = [];

    req.on('data', chunk => {
      body.push(chunk);
    });

    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString(); // message=hello+world
      const message = decodeURIComponent(parsedBody.split('=')[1].replace(/\+/g, ' '));

      fs.appendFile('message.txt', message + '\n', err => {
        res.writeHead(302, { Location: '/' });
        res.end();
      });
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page not found');
  }
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
