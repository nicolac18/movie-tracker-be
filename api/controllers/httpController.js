const https = require('https');

exports.httpRequest = (options, error, success) => {
  const req = https.request(options, (res) => {
    const chunks = [];

    res.setEncoding('utf-8');

    res.on('data', (chunk) => {
      chunks.push(chunk);
    });

    res.on('end', () => {
      success(chunks);
    });

    req.on('error', (err) => {
      error(err);
    });
  });

  req.end();
};
