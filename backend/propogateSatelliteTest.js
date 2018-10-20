const fs = require('fs');
const satelliteParser = require('satellite.js');

const tleData = fs.readFileSync(`${__dirname}/data/tle_data.json`);

const tleArr = JSON.parse(tleData);

const randomSatelliteIndex = Math.round(Math.random() * 17000);
const satellite = tleArr[randomSatelliteIndex];

const appendToFile = (fileName, content) => {
  fs.appendFileSync(fileName, content);
}

// appendToFile('satelliteIterativePlot.csv', `Object Name,TimeStamp,Latitude,Longitude`);

const satRecord = satelliteParser.twoline2satrec(satellite.TLE_LINE1, satellite.TLE_LINE2);
const predictions = [];
if (satRecord) {
  const startOfPropagation = Date.now();
  for (let i = startOfPropagation; i < startOfPropagation + 1000*60*60*24; i += 1000 * 60 * 1) {
    const futureTime = new Date(startOfPropagation + i);
    const positionAndVelocity = satelliteParser.propagate(satRecord, futureTime);
    // get position and velocity components
    const positionEci = positionAndVelocity.position;
    const velocityEci = positionAndVelocity.velocity;

    if (positionEci) {
      // get position object
      const gmst = satelliteParser.gstime(futureTime);
      const positionGd = satelliteParser.eciToGeodetic(positionEci, gmst);

      // get position in radians
      const longitude = positionGd.longitude;
      const latitude  = positionGd.latitude;
      const height    = positionGd.height;

      // convert to lat/long in degress
      const longitudeStr = satelliteParser.degreesLong(longitude);
      const latitudeStr  = satelliteParser.degreesLat(latitude);

      console.log(`time in the future: ${futureTime}, lat: ${latitudeStr}, long: ${longitudeStr}`)
      // appendToFile('satelliteIterativePlot.csv', `${satellite.OBJECT_NAME},${futureTime},${latitudeStr},${longitudeStr}\n`);
      predictions.push({timestamp: futureTime, lat: latitudeStr, long: longitudeStr});
    }
  }
}

appendToFile('satelliteIterativeData2.json', JSON.stringify(predictions));