const fs = require('fs');
const satelliteParser = require('satellite.js');

const tleData = fs.readFileSync(`${__dirname}/data/tle_data.json`);

const tleArr = JSON.parse(tleData);

// console.dir(tleArr);

const appendToFile = (fileName, content) => {
  fs.appendFileSync(fileName, content);
}

appendToFile('satellitePositionData.csv', `Object Name,Latitude,Longitude`);

tleArr.map((satellite) => {
  const satRecord = satelliteParser.twoline2satrec(satellite.TLE_LINE1, satellite.TLE_LINE2);
  
  if (satRecord) {
    // get positionAndVelocity calc for iteration
    const positionAndVelocity = satelliteParser.propagate(satRecord, new Date());

    // get position and velocity components
    const positionEci = positionAndVelocity.position;
    const velocityEci = positionAndVelocity.velocity;

    if (positionEci) {
      // get position object
      const gmst = satelliteParser.gstime(new Date());
      const positionGd = satelliteParser.eciToGeodetic(positionEci, gmst);

      // get position in radians
      const longitude = positionGd.longitude;
      const latitude  = positionGd.latitude;
      const height    = positionGd.height;

      // convert to lat/long in degress
      const longitudeStr = satelliteParser.degreesLong(longitude);
      const latitudeStr  = satelliteParser.degreesLat(latitude);

      console.log(`satellite name: ${satellite.OBJECT_NAME}, lat: ${latitudeStr}, long: ${longitudeStr}`)
      appendToFile('satellitePositionData.csv', `${satellite.OBJECT_NAME},${latitudeStr},${longitudeStr}\n`);
    }
  }
});

// const satRecord = satelliteParser.twoline2satrec(tleLine1, tleLine2);

// const satRecord = satelliteParser.twoline2satrec()
