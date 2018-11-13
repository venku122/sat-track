const Stream = require('stream')
const satelliteParser = require('satellite.js');
const { getTLEList } = require('./tle');
const { PropogationStream } = require('./propogationStream');
const { MergeStream } = require('./mergeStream');

const propogatePerPeriod = async (satelliteID, periodsToSim) => {
  const tleList = await getTLEList();  
  const satellite = tleList.find(tle => tle.NORAD_CAT_ID === satelliteID);
  if (!satellite) {
    return ({
      error: "No satellite with that ID was found in the catalog",
      satelliteID,
    });
  }
  const satRecord = satelliteParser.twoline2satrec(satellite.TLE_LINE1, satellite.TLE_LINE2);
  let predictions = [];
  const start = Date.now();
  const periodMinutes = Number.parseInt(satellite.PERIOD, 10);
  const end = start + ((periodMinutes * 60 * 1000) * periodsToSim);
  const step = (end - start) / (1000 * periodsToSim); // create 1000 iterations for each period; keeps data size down, roughly
  if (satRecord) {
    predictions = await propogationSim(satRecord, start, end, step)
  }
  return predictions;
}

const propogatePerPeriodStream = async (satelliteID, periodsToSim, id = -1) => {
  const tleList = await getTLEList();  
  const satellite = tleList.find(tle => tle.NORAD_CAT_ID === satelliteID);
  if (!satellite) {
    return ({
      error: "No satellite with that ID was found in the catalog",
      satelliteID,
    });
  }
  const satRecord = satelliteParser.twoline2satrec(satellite.TLE_LINE1, satellite.TLE_LINE2);
  let predictions = [];
  const start = Date.now();
  const periodMinutes = Number.parseInt(satellite.PERIOD, 10);
  const end = start + ((periodMinutes * 60 * 1000) * periodsToSim);
  const step = (end - start) / (1000 * periodsToSim); // create 1000 iterations for each period; keeps data size down, roughly
  if (satRecord) {
    predictionsStream = propogationSimStream(satRecord, start, end, step, id);
  }
  return predictionsStream;
}

const propogatePerPeriodStreamObjMode = async (satelliteID, periodsToSim, id = -1) => {
  const tleList = await getTLEList();  
  const satellite = tleList.find(tle => tle.NORAD_CAT_ID === satelliteID);
  if (!satellite) {
    return ({
      error: "No satellite with that ID was found in the catalog",
      satelliteID,
    });
  }
  const satRecord = satelliteParser.twoline2satrec(satellite.TLE_LINE1, satellite.TLE_LINE2);
  const start = Date.now();
  const periodMinutes = Number.parseInt(satellite.PERIOD, 10);
  const end = start + ((periodMinutes * 60 * 1000) * periodsToSim);
  const step = (end - start) / (1000 * periodsToSim); // create 1000 iterations for each period; keeps data size down, roughly
  if (satRecord) {
    predictionsStream = propogationSimStream(satRecord, start, end, step, id, { objectMode: true });
  }
  return predictionsStream;
}

const distributedSimStream = async (satelliteID, periodsToSim) => {

  /*
  const propogationResults1 = await propogateStream
  const propogationResults1 = await propogateStream
  const propogationResults1 = await propogateStream
  const testDuplexStream = new MergeStream([
    propogationResults1,
    propogationResults2,
    propogationResults3
  ]);
  // res.send(propogationResults);
  // propogationResults.pipe(res);
  */
 const tleList = await getTLEList();  
 const satellite = tleList.find(tle => tle.NORAD_CAT_ID === satelliteID);
 if (!satellite) {
   return ({
     error: "No satellite with that ID was found in the catalog",
     satelliteID,
   });
 }
 const satRecord = satelliteParser.twoline2satrec(satellite.TLE_LINE1, satellite.TLE_LINE2);
 const simSteps = periodsToSim * 1000;
 const numWorkUnits = simSteps / 50;
 const streams = [];
 const firstStart = Date.now();
 const periodMinutes = Number.parseInt(satellite.PERIOD, 10);
 const finalEnd = firstStart + ((periodMinutes * 60 * 1000) * periodsToSim);
 const step = (finalEnd - firstStart) / (1000 * periodsToSim);
 for (let i = 0; i < 4; i++) {
  const duration = (finalEnd - firstStart) / 4;
  const offset = duration * i;
  const stream = await propogateStream(satRecord, firstStart + offset, firstStart + offset + duration, step, `stream: ${i}`);
  streams.push(stream);
 }
 return await new MergeStream(streams);
}

const propogate = async (satelliteID, start, end, step) => {
  const tleList = await getTLEList();  
  const satellite = tleList.find(tle => tle.NORAD_CAT_ID === satelliteID);
  if (!satellite) {
    return ({
      error: "No satellite with that ID was found in the catalog",
      satelliteID,
    });
  }

  const satRecord = satelliteParser.twoline2satrec(satellite.TLE_LINE1, satellite.TLE_LINE2);
  let predictions = [];
  if (satRecord) {
    predictions = await propogationSim(satRecord, start, end, step)
  }
  return predictions;
}

const propogateStream = async (satRecord, start, end, step, id) => {
  let predictionStream;
  if (satRecord) {
    predictionStream = await propogationSimStream(satRecord, start, end, step, id, { objectMode: true });
  }
  return predictionStream;
}

const propogationSim = async (satRecord, startOfPropagation, endOfPropogation, step) => {
  let numIterations = 0;
  const predictions = [];
  for (let i = startOfPropagation; i < endOfPropogation; i += step) {
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
      predictions.push({timestamp: futureTime, lat: latitudeStr, long: longitudeStr, height});
    }
    numIterations++;
  }
  return predictions;
}

  /*
  var ParseFile = function(filename) {

    var ts = require('stream').Transform();

    ts._transform = function (chunk, enc, next) {
      parsedChunk = '<chunk>' + chunk + '</chunk>'; // Do some parsing here...
      this.push(parsedChunk);
      next();
    };

    return fs.createReadStream(filename).pipe(ts);
  };   
  */
 /*
  create function
  create transform stream
  define its transform prop
  return readstream with file and piped to transform
 */
/*
var Readable = require('stream').Readable;
var rs = Readable();

var c = 97;
rs._read = function () {
    rs.push(String.fromCharCode(c++));
    if (c > 'z'.charCodeAt(0)) rs.push(null);
};

rs.pipe(process.stdout);
*/

/*
const propogationSimStream = async (satRecord, startOfPropagation, endOfPropogation, step) => {
  // const predictions = [];
  const readable = new Stream.Readable({objectMode: false});

  // readable.pipe(writable);
  readable._read = () => {
    let numIterations = 0;
    for (let i = startOfPropagation; i < endOfPropogation; i += step) {
      if (numIterations % 10000 === 0) console.log(`starting iteration: ${numIterations}`);
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
        // predictions.push({timestamp: futureTime, lat: latitudeStr, long: longitudeStr, height});
        if(!readable.push(JSON.stringify({timestamp: futureTime, lat: latitudeStr, long: longitudeStr, height}))) {

        }
      }
      numIterations++;
    }
    readable.push(null);
  }
  return readable;
}
*/

const propogationSimStream = async (satRecord, startOfPropagation, endOfPropogation, step, id, opts = { objectMode: false }) => {
  return new PropogationStream(satRecord, startOfPropagation, endOfPropogation, step, id, opts);
}



module.exports = {
  propogate,
  propogateStream,
  propogatePerPeriod,
  propogatePerPeriodStream,
  propogatePerPeriodStreamObjMode,
  distributedSimStream
};