const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const app = express();
const argv = require('yargs')
    .options({
      'port': {
        type: 'number',
        description:
            'Specify the port this app should run on (default is 3000)',
      },
    })
    .strict()
    .argv;

// set default port
let port = 3000;

// handle args
if (argv.hasOwnProperty('port')) {
  if (Number.isInteger(argv.port)) {
    port = argv.port;
  } else {
    console.log('Error: Port has to be an integer');
  }
}

// check if project is built
if (! fs.existsSync(path.join(__dirname, 'dist/neanderthals-vr.js'))) {
  console.log('Could not find dist/neanderthals-vr.js');
  console.log('Use one of the following commands to build the project');
  console.log('npm run build-dev #build for development');
  console.log('npm run build-prod #build for production');
  process.exit(1);
}

app.use('/', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

https.createServer({
  key: fs.readFileSync('./ssl/server.key'),
  cert: fs.readFileSync('./ssl/server.cert'),
}, app)
    .listen(port, () => {
      console.log(`Your app is live on https://localhost:${port}/ !`);
    });

