// Simple script to test the API without browser CORS restrictions
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 1234,
  path: '/api/prompt',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const data = JSON.stringify({
  prompt: 'Test message from Node.js'
});

console.log('Sending test request to API...');

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:');
    try {
      const parsedData = JSON.parse(responseData);
      console.log(JSON.stringify(parsedData, null, 2));
    } catch (e) {
      console.log(responseData);
    }
    
    if (res.statusCode === 200) {
      console.log('\nAPI is working correctly! ✅');
    } else {
      console.log('\nAPI returned an error status code ❌');
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
  console.log('\nAPI connection failed ❌');
});

// Write data to request body
req.write(data);
req.end();

console.log('Request sent, waiting for response...');