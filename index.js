const fs = require('fs');
const http = require('http');
const url = require('url');

// read and parse laptop data
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const latptopData = JSON.parse(json);

// create web server
const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;

  if (pathName === '/products' || pathName === '/') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end('This is products page');
  } else if (pathName === '/laptop' && id < latptopData.length) {
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end(`This is laptop page for laptop ${id}`);
  } else {
    res.writeHead(404, { 'Content-type': 'text/html' });
    res.end('URL was not found on the server');
  }
});

server.listen(1337, '127.0.0.1', () => {
  console.log('Listening for requests now');
});
