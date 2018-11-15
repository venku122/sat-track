const mongoose = require('mongoose');

const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
  console.log('connected to mongodb');
});

const tleSchema = new mongoose.Schema({
  ORDINAL: Number,
  COMMENT: String,
  ORIGINATOR: String,
  NORAD_CAT_ID: Number,
  OBJECT_NAME: String,
  OBJECT_TYPE: String,
  CLASSIFICATION_TYPE: String,
  INTLDES: String,
  EPOCH: String,
  EPOCH_MICROSECONDS: Number,
  MEAN_MOTION: Number,
  ECCENTRICITY: Number,
  INCLINATION: Number,
  RA_OF_ASC_NODE: Number,
  ARG_OF_PERICENTER: Number,
  MEAN_ANOMALY: Number,
  EPHEMERIS_TYPE: Number,
  ELEMENT_SET_NO: Number,
  REV_AT_EPOCH: Number,
  BSTAR: Number,
  MEAN_MOTION_DOT: String,
  MEAN_MOTION_DDOT: Number,
  FILE: String,
  TLE_LINE0: String,
  TLE_LINE1: String,
  TLE_LINE2: String,
  OBJECT_ID: String,
  OBJECT_NUMBER: Number,
  SEMIMAJOR_AXIS: Number,
  PERIOD: Number,
  APOGEE: Number,
  PERIGEE: Number
});

const TLE = mongoose.model('TLE', tleSchema);

module.exports = {
  TLE
};

/*
{
ORDINAL: "1",
COMMENT: "GENERATED VIA SPACETRACK.ORG API",
ORIGINATOR: "JSPOC",
NORAD_CAT_ID: "634",
OBJECT_NAME: "SYNCOM 2 (A 26)",
OBJECT_TYPE: "PAYLOAD",
CLASSIFICATION_TYPE: "U",
INTLDES: "63031A",
EPOCH: "2018-11-09 15:19:24",
EPOCH_MICROSECONDS: "666816",
MEAN_MOTION: "1.002726",
ECCENTRICITY: "0.0004536",
INCLINATION: "34.9604",
RA_OF_ASC_NODE: "338.8824",
ARG_OF_PERICENTER: "157.7623",
MEAN_ANOMALY: "228.3281",
EPHEMERIS_TYPE: "0",
ELEMENT_SET_NO: "999",
REV_AT_EPOCH: "20252",
BSTAR: "0",
MEAN_MOTION_DOT: "-1.97e-06",
MEAN_MOTION_DDOT: "0",
FILE: "2358186",
TLE_LINE0: "0 SYNCOM 2 (A 26)",
TLE_LINE1: "1 634U 63031A 18313.63847994 -.00000197 +00000-0 +00000-0 0 9990",
TLE_LINE2: "2 634 034.9604 338.8824 0004536 157.7623 228.3281 01.00272600202521",
OBJECT_ID: "1963-031A",
OBJECT_NUMBER: "634",
SEMIMAJOR_AXIS: "42164.503",
PERIOD: "1436.085",
APOGEE: "35805.494",
PERIGEE: "35767.242"
},
*/