const { test } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { executeWithCurl } = require('../src/commands/emit.js');

test('executeWithCurl sends correct HTTP request over the wire', async () => {
  let capturedRequest = null;
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      capturedRequest = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: body
      };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(capturedRequest));
    });
  });

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  const mockIR = {
    'schema-version': '1.0',
    method: 'PUT',
    host: `localhost:${port}`,
    uri: '/api/update',
    version: 'HTTP/1.1',
    headers: [
      { name: 'X-Tool', value: 'httpt' }
    ]
  };

  try {
    await executeWithCurl(mockIR, null, 'http');

    assert.ok(capturedRequest, 'Server did not receive a request');
    assert.strictEqual(capturedRequest.method, 'PUT');
    assert.strictEqual(capturedRequest.url, '/api/update');
    assert.strictEqual(capturedRequest.headers['x-tool'], 'httpt');
  } finally {
    server.close();
  }
});
