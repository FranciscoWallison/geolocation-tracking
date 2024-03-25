const express = require("express");
const Gpsd = require("node-gpsd-client");
const https = require('https');
const fs = require('fs');
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();


// Configuração do servidor HTTPS
const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
  passphrase: '123456'
};

app.use(
  cors({
    origin: "*",
  })
);
// 123456

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "/public")));
// app.use(express.static(path.join(__dirname, '/public/cep')));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const gpsd_teste = require("node-gpsd");

// Configuração do GPSD
const listener = new gpsd_teste.Listener({
  port: 2947,
  hostname: "192.168.1.10",
  parse: true,
});

listener.connect(() => {
  console.log("GPSD connected");
  listener.watch();
});

// Rota para obter dados de localização
app.get("/location", (req, res) => {
  if (listener.isConnected()) {
    res.json(listener.getState());
  } else {
    res.status(500).json({ error: "GPSD not connected" });
  }
});

// Rota para verificar a localização recebida do frontend
app.post("/check-location", (req, res) => {
  const { latitude, longitude } = req.body;

  // Aqui você pode implementar a lógica para verificar se a localização é permitida ou não
  // Por exemplo, você pode comparar a localização recebida com locais permitidos ou proibidos

  // Exemplo de verificação simples:
  const allowedLocation = { latitude: 40.7128, longitude: -74.006 }; // Exemplo: Nova York
  // const allowedLocation = { latitude: -3.71839, longitude: -38.5434 }; // Exemplo: fortaleza

  // Latitude: -3.7393287
  // Longitude: -38.5242828
  const allowedRadius = 0.5; // Em graus (aproximadamente 50 km)

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

// Iniciar o servidor Express
const PORT = process.env.PORT || 443; // Porta padrão para HTTPS
https.createServer(options, app).listen(PORT, () => {
    console.log(`Servidor HTTPS rodando na porta ${PORT}`);
});