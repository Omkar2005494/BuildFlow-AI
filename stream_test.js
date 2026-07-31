const fs = require('fs');
const https = require('https');

const req = https.request({
  hostname: 'integrate.api.nvidia.com',
  port: 443,
  path: '/v1/chat/completions',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer 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',
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream'
  }
}, (res) => {
  console.log('Status Code:', res.statusCode);
  res.on('data', (d) => {
    process.stdout.write(d.toString());
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(JSON.stringify({
  model: "meta/llama-3.1-70b-instruct",
  messages: [{role: "user", content: "Generate a massive JSON object with 10 keys and string values."}],
  max_tokens: 1000,
  temperature: 0.2,
  stream: true
}));

req.end();
