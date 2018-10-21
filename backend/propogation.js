const satelliteParser = require('satellite.js');
const { getTLEList } = require('./tle');


const propogate = async (satelliteID, start, end, step) => {
  const tleList = await getTLEList();  

  const satellite = tleList.find(tle => tle.NORAD_CAT_ID);

  if (!satellite) {
    return ({
      error: "No satellite with that ID was found in the catalog",
      satelliteID,
    });
  }

  const satRecord = satelliteParser.twoline2satrec(satellite.TLE_LINE1, satellite.TLE_LINE2);
  const predictions = [];
  if (satRecord) {
    const startOfPropagation = start;
    let numIterations = 0;
    for (let i = startOfPropagation; i < end; i += step) {
      if (numIterations % 10 === 0) console.log(`starting iteration: ${numIterations}`);
      const futureTime = new Date(i);
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

        // console.log(`time in the future: ${futureTime}, lat: ${latitudeStr}, long: ${longitudeStr}`)
        // appendToFile('satelliteIterativePlot.csv', `${satellite.OBJECT_NAME},${futureTime},${latitudeStr},${longitudeStr}\n`);
        predictions.push({timestamp: futureTime, lat: latitudeStr, long: longitudeStr});
      }
      numIterations++;
    }
  }

  return predictions;


}



module.exports = {
  propogate
};