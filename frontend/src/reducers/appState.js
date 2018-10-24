import ActionTypes from '../actions/actionTypes';
import Immutable from 'immutable';

const DEFAULT_STATE = Immutable.Map({
  isRunning: false,
  simData: new Immutable.List(),
  satellites: new Immutable.Map(),
  currentSimSatellite: null,
});


export default function reducer(state = DEFAULT_STATE, action) {
  const {
    type,
    simData,
    satelliteID,
    satellites,
    satelliteInfo,
  } = action;

  switch(type) {
    case ActionTypes.DOWNLOAD_SATELLITE_DATA_SUCCESSFUL:
      return state.merge({
        simData,
      });
    case ActionTypes.GET_SATELLITE_INFO_SUCCESSFUL:
      return state.merge({
        satelliteData: satelliteData.mergeIn(satelliteID, satelliteInfo),
      });
    case ActionTypes.GET_PROPOGATION_SUCCESSFUL:
    case ActionTypes.GET_PERIOD_PROPOGATION_SUCCESSFUL:
      return state.merge({
        simData,
        currentSimSatellite: satelliteID,
      });
    case ActionTypes.GET_SATELLITE_IDS_SUCCESSFUL:
      return state.merge({
        satellites,
      });
    default:
      return state;
  }
}