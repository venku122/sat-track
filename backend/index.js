const fs = require('fs');

const tleData = fs.readFileSync(`${__dirname}/data/tle_data.json`);

const tleArr = JSON.parse(tleData);

// console.dir(tleArr);

tleArr.map((satellite) => {
  console.log(`satellite name: ${satellite.OBJECT_NAME}`)
})
