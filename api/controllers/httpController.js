const https = require('https');

exports.httpRequest = (data, options, success, error) => {
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

  req.write(JSON.stringify(data));
  req.end();
};
