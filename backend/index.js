const fs = require('fs');
const express = require('express');
const { propogate } = require('./propogation');
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

app.listen(port, () => console.log(`Sat-Track Server is listening on port ${port}`));
