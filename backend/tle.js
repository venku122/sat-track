const fs = require('fs');
const request = require('request');
const { TLE } = require('./db');
// this function will handle getting the data from the api, and keeping it updated
// currently uses a locally stored file

let tleDataFresh = null;
request.post('https://www.space-track.org/ajaxauth/login',
{ form: {
    identity: process.env.SPACE_TRACK_USER,
    password: process.env.SPACE_TRACK_PASSWORD,
  },
  jar: true,
}, (err, resp, body) => {
  console.log(`error: ${err}`);
  console.log(`response: ${resp}`);
  console.log(`body: ${body}`);
  request.get('https://www.space-track.org/basicspacedata/query/class/tle_latest/ORDINAL/1/EPOCH/%3Enow-30/orderby/NORAD_CAT_ID/format/json', { jar: true }, (err, resp, body) => {
    // console.log(`body: ${body}`);
    tleDataFresh = JSON.parse(body);
    console.log('loaded fresh TLE data');
    saveTLEDataToDB(tleDataFresh);
  });
});

const saveTLEDataToDB = (tleData) => {
  for (let i = 0; i < tleData.length; i++) {
    const tleInstance = new TLE(tleData[i]);
    tleInstance.save((err, instance) => {
      if (err) {
        console.error(err);
      }
      console.log(`tle saved to mongodb: ${instance.NORAD_CAT_ID}`);
    });
  }
}

const getTLEList = async () => {
  if (tleDataFresh) return tleDataFresh; // use fresh data instead
  const tleData = fs.readFileSync(`${__dirname}/data/tle_data.json`);

  const tleArr = JSON.parse(tleData);
  return tleArr;
};

module.exports = {
  getTLEList,
};
