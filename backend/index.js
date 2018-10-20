const fs = require('fs');
const express = require('express');

const app = express();
const port = 4000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/downloadSatellitePrediction', (req, res) => {
  res.contentType('json');
  const satelliteData = fs.readFileSync(`${__dirname}/data/satelliteIterativeData2.json`);
  res.send(satelliteData);
});

app.listen(port, () => console.log(`Sat-Track Server is listening on port ${port}`));
