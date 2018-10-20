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
      dispatch({
        type: ActionTypes.DOWNLOAD_SATELLITE_DATA_SUCCESSFUL,
        satelliteData: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: ActionTypes.DOWNLOAD_SATELLITE_DATA_FAILED
      });
    })
  }
}