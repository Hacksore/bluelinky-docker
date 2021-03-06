const express = require("express");
const BlueLinky = require("bluelinky");
const bodyParser = require("body-parser");
const basicAuth = require("express-basic-auth");
const isDocker = require('is-docker');
// configs

const configPath = isDocker() ? "/config" : ".";
const bluelinkyConfig = require(`${configPath}/config.json`);
const userCreds = require(`${configPath}/users.json`);

const app = express();
app.use(basicAuth({
  users: userCreds
}));

app.use(bodyParser.json());

let client;

const middleWare = async (req, _, next) => {
  const ip = req.connection.remoteAddress;
  console.log(req.path, ip);

  // we already have a client
  if(client) {
    console.log("Already have a vehicle defined, moving on");
    const { vehicleId } = req.body;

    // allow to call on specified vehicle by vin number
    if (vehicleId) {
      console.log("Found vehicleId in request, reset vehicle to target");
      req.vehicle = client.getVehicle(vehicleId);
    } 

    return next();
  }
  
  console.log("Creating a new vehicle instance");
  client = new BlueLinky(bluelinkyConfig);

  client.on("ready", () => {
    // by default we use the vin from the config (most cases people only have one car)    
    req.vehicle = client.getVehicle(bluelinkyConfig.vin);
    return next();
  });
};

app.use(middleWare);

app.post("/start", async (req, res) => {
  let response;

  const {
    airCtrl = true,
    igniOnDuration = 10,
    airTempvalue = 70,
    defrost = false,
    heating1 = false,
  } = req.body;

  try {
    response = await req.vehicle.start({
      airCtrl,
      igniOnDuration,
      airTempvalue,
      defrost,
      heating1,
    });
  } catch (e) {
    response = {
      error: e.message,
    };
  }
  res.send(response);
});

app.post("/lock", async (req, res) => {
  let response;
  try {
    response = await req.vehicle.lock();
  } catch (e) {
    console.log(e);
    response = {
      error: e.message,
    };
  }
  res.send(response);
});

app.get("/", async (req, res) => {
  let response;
  try {
    response = await req.vehicle.status();
  } catch (e) {
    console.log(e);
    response = {
      error: e.message,
    };
  }
  res.send(response);
});

app.listen(8080, "0.0.0.0");
