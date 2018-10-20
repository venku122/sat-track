const fs = require('fs');
const express = require('express');

const app = express();
const port = 4000;

app.get('/downloadSatellitePrediction', (req, res) => {
  res.contentType('json');
  const satelliteData = fs.readFileSync(`${__dirname}/data/satelliteIterativeData.json`);
  res.send(satelliteData);
});

app.listen(port, () => console.log(`Sat-Track Server is listening on port ${port}`));
