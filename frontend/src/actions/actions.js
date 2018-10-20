import axios from 'axios';
import Immutable from 'immutable';
import ActionTypes from './actionTypes';

const urlBase = 'http://localhost:4000';

export const downloadSatelliteData = () => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.DOWNLOAD_SATELLITE_DATA_ATTEMPTED
    });

    axios.get(`${urlBase}/downloadSatellitePrediction`)
    .then((res) => {
      let parsedJSON;
      try {
        parsedJSON = JSON.parse(res);
      } catch (e) {
        return dispatch({
          type: ActionTypes.DOWNLOAD_SATELLITE_DATA_FAILED
        });
      }
      dispatch({
        type: ActionTypes.DOWNLOAD_SATELLITE_DATA_SUCCESSFUL,
        satelliteData: parsedJSON,
      });
    })
    .catch((err) => {
      dispatch({
        type: ActionTypes.DOWNLOAD_SATELLITE_DATA_FAILED
      });
    })
  }
}