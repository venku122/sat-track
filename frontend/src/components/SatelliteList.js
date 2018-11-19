import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { getSatellitePeriodPropogation, getSatelliteInfo } from '../actions/actions';
import '../styles/satelliteList.css';

class SatelliteList extends Component {

  onSelectSatellite(satelliteID) {
    const { getSatelliteDetails, simulateSatellitePeriod } = this.props;

    simulateSatellitePeriod(satelliteID, 5) // simulate 5 periods, may customize further
    getSatelliteDetails(satelliteID); // get additional metadata on satellite
  }

  render() {
    const { satellites } = this.props;
    const smallSatellites = satellites.slice(0, 50);
    return (
      <div className="satellite-list-container">
        <List>
          {smallSatellites.valueSeq().map(satelllite => (
            <ListItem
              key={`item-${satelllite.get('id')}`}
              onClick={() => this.onSelectSatellite(satelllite.get('id'))}
            >
              <ListItemText primary={`${satelllite.get('name')}`} />
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

SatelliteList.propTypes = {
  simulateSatellitePeriod: PropTypes.func.isRequired,
  getSatelliteDetails: PropTypes.func.isRequired,
  satellites: PropTypes.instanceOf(Immutable.List).isRequired,
};

const mapDispatchToProps = dispatch => ({
  simulateSatellitePeriod: (satelliteID, periods) => {
    dispatch(getSatellitePeriodPropogation(satelliteID, periods));
  },
  getSatelliteDetails: (satelliteID) => {
    dispatch(getSatelliteInfo(satelliteID));
  }
});

export default connect(
  null,
  mapDispatchToProps
)(SatelliteList);
