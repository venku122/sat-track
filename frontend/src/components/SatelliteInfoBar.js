import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

class SatelliteInfoBar extends Component {
  render() {
    const { satelliteInfo } = this.props;

    if (!satelliteInfo) return null;

    /*
      satelliteID: Number.parseInt(satellite.NORAD_CAT_ID, 10),
      name: satellite.OBJECT_NAME,
      type: satellite.OBJECT_TYPE,
      classification: satellite.CLASSIFICATION_TYPE,
      apogee: Number.parseFloat(satellite.APOGEE, 10),
      perigee: Number.parseFloat(satellite.PERIGEE, 10),
      period: Number.parseFloat(satellite.PERIOD, 10),
    */

    return (
      <div>
        <span style={{display: 'block'}}>{satelliteInfo.get('name')}</span>
        <span style={{display: 'block'}}>{satelliteInfo.get('type')}</span>
        <span style={{display: 'block'}}>{satelliteInfo.get('classification')}</span>
        <span style={{display: 'block'}}>{satelliteInfo.get('apogee')}</span>
        <span style={{display: 'block'}}>{satelliteInfo.get('perigee')}</span>
        <span style={{display: 'block'}}>{satelliteInfo.get('period')}</span>
      </div>
    );
  }
}

SatelliteInfoBar.propTypes = {
  satelliteInfo: PropTypes.instanceOf(Immutable.Map).isRequired,
};

export default SatelliteInfoBar;
