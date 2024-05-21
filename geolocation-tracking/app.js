const express = require('express');
const browserSync = require('browser-sync');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 443;

// Configuração do servidor HTTPS
const httpsOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  passphrase: '123456'
};

app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Configuração do GPSD usando node-gpsd
const gpsd = require('node-gpsd');

const daemon = new gpsd.Daemon({
  program: 'gpsd',
  device: '/dev/ttyUSB0', // Ajuste o dispositivo conforme necessário
  port: 2947,
  pid: '/tmp/gpsd.pid',
  readOnly: false,
  logger: {
    info: console.log,
    warn: console.warn,
    error: console.error
  }
});

const listener = new gpsd.Listener({
  port: 2947,
  hostname: 'localhost', // Use "localhost" ou "127.0.0.1" se estiver na mesma máquina
  parse: true,
});

daemon.start(function() {
  console.log('GPSD started');
  listener.connect(() => {
    console.log("GPSD connected");
    listener.watch();
  });
});

listener.on('error', (err) => {
  console.error('GPSD error:', err);
});

app.get("/location", (req, res) => {
  if (listener.isConnected()) {
    res.json(listener.getState());
  } else {
    res.status(500).json({ error: "GPSD not connected" });
  }
});

app.post("/check-location", (req, res) => {
  const { latitude, longitude } = req.body;
  const allowedLocation = { latitude: 40.7128, longitude: -74.006 };
  const allowedRadius = 0.5;
  const distance = Math.sqrt(
    Math.pow(latitude - allowedLocation.latitude, 2) +
    Math.pow(longitude - allowedLocation.longitude, 2)
  );

  if (distance <= allowedRadius) {
    res.json({ allowed: true, message: "Localização permitida." });
  } else {
    res.json({ allowed: false, message: "Localização não permitida." });
  }
});

// Crie um servidor HTTPS e passe para o Browser-Sync
const server = https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});

// Configuração do Browser-Sync
browserSync.init({
  proxy: `https://localhost:${PORT}`,
  port: PORT + 1,
  files: ['public/**/*.*'],
  https: {
    key: httpsOptions.key,
    cert: httpsOptions.cert,
    passphrase: httpsOptions.passphrase
  },
  open: false,
  notify: true
});

browserSync.watch('public/**/*.*').on('change', browserSync.reload);
