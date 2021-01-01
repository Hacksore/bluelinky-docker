const express = require('express');
const BlueLinky = require('bluelinky');
const bodyParser = require('body-parser');
const config = require('./config.json');

const app = express();
app.use(bodyParser.json());

let vehicle;

const middleWare = async (req, res, next) => {
  const ip = req.connection.remoteAddress;
  console.log(req.path, ip);

  const client = new BlueLinky({ 
    username: config.username, 
    password: config.password,
    pin: config.pin,
    region: config.region
  });

  client.on('ready', () => {
    vehicle = client.getVehicle(config.vin);
    return next();
  });
};

app.use(middleWare);

app.post('/start', async (req, res) => {
  let response;
  try {
    response = await vehicle.start({
      airCtrl: true,
      igniOnDuration: 10,
      airTempvalue: 60
    });
  } catch (e) {
    response = {
      error: e.message
    };
  }
  res.send(response);
});

app.post('/lock', async (req, res) => {
  let response;
  try {
    response = await vehicle.lock();
  } catch (e) {
    console.log(e);
    response = {
      error: e.message
    };
  }
  res.send(response);
});

app.get('/', async (req, res) => {
  let response;
  try {
    response = await vehicle.status();
  } catch (e) {
    console.log(e);
    response = {
      error: e.message
    };
  }
  res.send(response);
});

app.listen(8080, '0.0.0.0');
