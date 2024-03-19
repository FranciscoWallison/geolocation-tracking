const express = require("express");
const Gpsd = require("node-gpsd-client");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "/public")));
// app.use(express.static(path.join(__dirname, '/public/cep')));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});


const gpsdClient = new Gpsd({
  port: 2947, // default
  hostname: "localhost", // default
  parse: true,
});

gpsdClient.on("TPV", (data) => {
  console.log(data);
  // Envia os dados para os clientes conectados através de WebSocket, por exemplo
});

gpsdClient.connect();

app.listen(3000, () => {
  console.log("Servidor GPSD em execução na porta 3000");
});
