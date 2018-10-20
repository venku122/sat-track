import ActionTypes from '../actions/actionTypes';
import Immutable from 'immutable';

const DEFAULT_STATE = Immutable.Map({
  isRunning: false,
  satelliteData: [],
});


export default function reducer(state = DEFAULT_STATE, action) {
  const { type, satelliteData } = action;

  switch(type) {
    case ActionTypes.DOWNLOAD_SATELLITE_DATA_SUCCESSFUL:
      return state.merge({
        satelliteData,
      });
    default:
      return state;
  }
}