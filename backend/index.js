const fs = require('fs');
const express = require('express');
const { propogate, propogatePerPeriod } = require('./propogation');
const { getTLEList } = require('./tle');

const app = express();
const port = process.env.PORt ? process.env.PORT : 4000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/downloadSatellitePrediction', (req, res) => {
  res.contentType('json');
  const satelliteData = fs.readFileSync(`${__dirname}/data/satelliteIterativeData.json`);
  res.send(satelliteData);
});

/*
params:
- satelliteID: catalog string
- start: millis
- end: millis
- step: millis
*/
app.get('/propogate', async (req, res) => {
  const { satelliteID, start, end, step } = req.query;
  if (!satelliteID || !start || !end || !step) {
    res.status(400).send({ error: 'Missing required query params' });
  }
  // additional per-param validation here [TODO]
  const propogationResults = await propogate(satelliteID, Number.parseInt(start, 10),  Number.parseInt(end, 10),  Number.parseInt(step, 10));
  res.send(propogationResults);

});

/*
params:
- satelliteID: catalog string
*/
app.get('/propogatePeriod', async (req, res) => {
  const { satelliteID, periods } = req.query;
  if (!satelliteID) {
    res.status(400).send({ error: 'Missing required query params' });
  }
  const simPeriods = periods ? periods : 1; // if not given, simulate for one orbit period
  const propogationResults = await propogatePerPeriod(satelliteID, simPeriods)
  res.send(propogationResults);
});

/*
params
- satelliteID: catalog string
*/
app.get('/satelliteInfo', async (req, res) => {
  const tleList = await getTLEList();
  const satellite = tleList.find(tle => tle.NORAD_CAT_ID);
  const satelliteInfo = {
      satelliteID: Number.parseInt(satellite.NORAD_CAT_ID, 10),
      name: satellite.OBJECT_NAME,
      type: satellite.OBJECT_TYPE,
      classification: satellite.CLASSIFICATION_TYPE,
      apogee: Number.parseFloat(satellite.APOGEE, 10),
      perigee: Number.parseFloat(satellite.PERIGEE, 10),
      period: Number.parseFloat(satellite.PERIOD, 10),
    };
  res.send(satelliteInfo);
});

app.get('/satelliteIDs', async (req, res) => {
  const tleList = await getTLEList();
  const satelliteIDs = tleList.map( tle => tle.NORAD_CAT_ID);
  res.send(satelliteIDs);
});

app.listen(port, () => console.log(`Sat-Track Server is listening on port ${port}`));
