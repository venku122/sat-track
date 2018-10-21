const fs = require('fs');

// this function will handle getting the data from the api, and keeping it updated
// currently uses a locally stored file
const getTLEList = async () => {
  const tleData = fs.readFileSync(`${__dirname}/data/tle_data.json`);

  const tleArr = JSON.parse(tleData);
  return tleArr;
}

module.exports = {
  getTLEList,
};
