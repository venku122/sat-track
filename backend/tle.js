const fs = require('fs');
const request = require('request-promise');
const { TLE } = require('./db');
// this function will handle getting the data from the api, and keeping it updated
// currently uses a locally stored file

let tleCache = null;

const getFreshTLEData = async () => {
  let response = await request.post('https://www.space-track.org/ajaxauth/login',{
    form: {
      identity: process.env.SPACE_TRACK_USER,
      password: process.env.SPACE_TRACK_PASSWORD,
    },
    jar: true,
  });

  console.log('got login credentials to space-track.org');
  response = await request.get('https://www.space-track.org/basicspacedata/query/class/tle_latest/ORDINAL/1/EPOCH/%3Enow-30/orderby/NORAD_CAT_ID/format/json',
  { jar: true });

  tleDataFresh = JSON.parse(response);
  console.log('loaded fresh TLE data');
  saveTLEDataToDB(tleDataFresh);
  return tleDataFresh;
}

const saveTLEDataToDB = (tleData) => {
  for (let i = 0; i < tleData.length; i++) {
    const tleInstance = new TLE(tleData[i]);
    tleInstance.save((err, instance) => {
      if (err) {
        console.error(err);
      }
      console.log(`tle ${i} saved to mongodb: ${instance.NORAD_CAT_ID}`);
    });
  }
}

const getTLEList = async () => {
  if (!tleCache) {
    const storedCount = await TLE.countDocuments();
    if (storedCount === 0) {
      const freshTLEData = await getFreshTLEData();
      tleCache = freshTLEData;
      console.log('using fresh data');
      return freshTLEData;
    }
    tleCache = await TLE.find();
    console.log('using mongo data');
    return tleCache;
  }

 if (tleCache) return tleCache; // use fresh data instead
 const tleData = fs.readFileSync(`${__dirname}/data/tle_data.json`);

 const tleArr = JSON.parse(tleData);
 console.log('using file data');
 return tleArr;
};

module.exports = {
  getTLEList,
};
