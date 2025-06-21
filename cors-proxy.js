// Enhanced CORS proxy server to help with API connectivity issues
const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 8080;
const TARGET_URL = 'http://localhost:1234';

// Function to collect the entire request body
const collectRequestBody = (request) => {
    return new Promise((resolve, reject) => {
        const body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        });
        request.on('end', () => {
            resolve(Buffer.concat(body).toString());
        });
        request.on('error', (err) => {
            reject(err);
        });
    });
};

const server = http.createServer(async (req, res) => {
    // Set CORS headers - very permissive for development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS preflight request');
        res.writeHead(200);
        res.end();
        return;
    }

    try {
        // Parse the request URL
        const parsedUrl = url.parse(req.url);
        const targetPath = parsedUrl.pathname + (parsedUrl.search || '');
        
        console.log(`Proxying ${req.method} request to: ${TARGET_URL}${targetPath}`);

        // Get request body if it exists
        let body = null;
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            body = await collectRequestBody(req);
            console.log(`Request body: ${body}`);
        }

        // Create options for the proxy request
        const options = {
            hostname: url.parse(TARGET_URL).hostname,
            port: url.parse(TARGET_URL).port || 80,
            path: targetPath,
            method: req.method,
            headers: { ...req.headers }
        };

        // Remove headers that would cause issues
        delete options.headers.host;
        delete options.headers.connection;
        
        // Create the proxy request
        const proxyReq = http.request(options, (proxyRes) => {
            // Copy all response headers
            Object.keys(proxyRes.headers).forEach(key => {
                res.setHeader(key, proxyRes.headers[key]);
            });
            
            // Ensure CORS headers are set on the response
            if (!res.getHeader('Access-Control-Allow-Origin')) {
                res.setHeader('Access-Control-Allow-Origin', '*');
            }
            
            res.writeHead(proxyRes.statusCode);
            
            // Log response info
            console.log(`Received response: ${proxyRes.statusCode}`);
            
            // Pipe the response back to the client
            proxyRes.pipe(res, { end: true });
        });

        // Handle errors
        proxyReq.on('error', (error) => {
            console.error('Proxy request error:', error);
            if (!res.headersSent) {
                res.writeHead(502, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Proxy Error', message: error.message }));
            }
        });

        // Send the body if it exists
        if (body) {
            proxyReq.write(body);
        }
        
        proxyReq.end();
        
    } catch (error) {
        console.error('Proxy server error:', error);
        if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Server Error', message: error.message }));
        }
    }
});

server.listen(PORT, () => {
    console.log(`Enhanced CORS proxy server running at http://localhost:${PORT}`);
    console.log(`Proxying requests to ${TARGET_URL}`);
    console.log(`To use this proxy, enable the "Use proxy CORS" toggle in the app`);
    console.log(`Press Ctrl+C to stop the proxy server`);
});