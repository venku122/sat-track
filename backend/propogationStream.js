/*
const { Readable } = require('stream');

class Counter extends Readable {
  constructor(opt) {
    super(opt);
    this._max = 1000000;
    this._index = 1;
  }

  _read() {
    const i = this._index++;
    if (i > this._max)
      this.push(null);
    else {
      const str = String(i);
      const buf = Buffer.from(str, 'ascii');
      this.push(buf);
    }
  }
}
*/

const { Readable } = require('stream');
const satelliteParser = require('satellite.js');

class PropogationStream extends Readable {
  constructor(satRecord, startOfPropagation, endOfPropogation, step, id, opt) {
    super(opt);
    this.satRecord = satRecord;
    this.startOfPropogation = startOfPropagation;
    this.endOfPropogation = endOfPropogation;
    this.stepSize = step;
    this.currentTime = startOfPropagation;
    this.runSim = true;
    this.numIterations = 0;
    this.id = id;
  }

  _read() {
    this.runSim = true;
    // for (let i = startOfPropagation; i < endOfPropogation; i += step) {
    while (this.runSim) {
      if (this.numIterations % 100000 === 0) console.log(`starting iteration: ${this.numIterations}`);
      const futureTime = new Date(this.currentTime);
      const positionAndVelocity = satelliteParser.propagate(this.satRecord, futureTime);
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
        if (!this.push(JSON.stringify({id: this.id, timestamp: futureTime, lat: latitudeStr, long: longitudeStr, height}))) {
          this.runSim = false;
        } else {
          this.runSim = true;
        }

      }
      this.numIterations = this.numIterations + 1;
      this.currentTime = this.currentTime + this.stepSize;
      if (this.currentTime >= this.endOfPropogation) {
        this.push(null);
        this.runSim = false;
      }
    }
  }
}

module.exports = {
  PropogationStream
};
