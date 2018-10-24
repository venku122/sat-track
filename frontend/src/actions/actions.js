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
        simData: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: ActionTypes.DOWNLOAD_SATELLITE_DATA_FAILED
      });
    })
  }
}

export const getSatelliteInfo = (satelliteID) => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.GET_SATELLITE_INFO_ATTEMPTED,
      satelliteID
    });
    axios.get(`${urlBase}/satelliteID`, { query: { satelliteID }})
    .then((res) => {
      dispatch({
        type: ActionTypes.GET_SATELLITE_INFO_SUCCESSFUL,
        satelliteInfo: res.data,
        satelliteID,
      });
    })
    .catch((err) => {
      dispatch({
        type: ActionTypes.GET_SATELLITE_INFO_FAILED
      });
    })
  }
}

export const getSatellitePropogation = (satelliteID, start, end, step) => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.GET_PROPOGATION_ATTEMPTED,
    });
    axios.get(`${urlBase}/propogate`, { query: { satelliteID, start, end, step }})
    .then((res) => {
      dispatch({
        type: ActionTypes.GET_PROPOGATION_SUCCESSFUL,
        simData: res.data,
        satelliteID,
      });
    })
    .catch((err) => {
      dispatch({
        type: ActionTypes.GET_PROPOGATION_FAILED
      });
    })
  }
}

export const getSatellitePeriodPropogation = (satelliteID, periods) => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.GET_PERIOD_PROPOGATION_ATTEMPTED,
    });
    axios.get(`${urlBase}/propogatePeriod`, { query: { satelliteID, periods }})
    .then((res) => {
      dispatch({
        type: ActionTypes.GET_PERIOD_PROPOGATION_SUCCESSFUL,
        simData: res.data,
        satelliteID,
      });
    })
    .catch((err) => {
      dispatch({
        type: ActionTypes.GET_PERIOD_PROPOGATION_FAILED
      });
    })
  }
}

export const getSatelliteIDs = () => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.GET_SATELLITE_IDS_ATTEMPTED,
    });
    axios.get(`${urlBase}/satelliteIDs`)
    .then((res) => {
      dispatch({
        type: ActionTypes.GET_SATELLITE_IDS_SUCCESSFUL,
        satellites: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: ActionTypes.GET_SATELLITE_IDS_FAILED
      });
    })
  }
}