import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import SatelliteMap from '../components/SatelliteMap';
import SatelliteList from '../components/SatelliteList';
import AltitudeChart from '../components/AltitudeChart';
import withRoot from '../withRoot';
import { downloadSatelliteData, getSatelliteIDs } from '../actions/actions';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
  content: {
    display: 'flex',
    width: '100%',
  },
});

class SatellitePredictions extends React.Component {
  componentDidMount() {}

  handleClick() {
    const { /* fetchSatelliteData, */ fetchSatellites } = this.props;
    // fetchSatelliteData();
    fetchSatellites();
  }

  render() {
    const { classes, simData, satellites } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.content}>
          <SatelliteList satellites={satellites} />
          <SatelliteMap predictions={simData} />
          <AltitudeChart predictions={simData} />
        </div>
        <Button
          variant="contained"
          color="secondary"
          onClick={this.handleClick}
        >
          Fetch Satellite Data
        </Button>
      </div>
    );
  }
}

SatellitePredictions.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchSatelliteData: PropTypes.func.isRequired,
  fetchSatellites: PropTypes.func.isRequired,
  simData: PropTypes.instanceOf(Immutable.List).isRequired,
  currentSimID: PropTypes.string,
  satellites: PropTypes.object,
};

const mapStateToProps = state => ({
  simData: state.appState.get('simData'),
  currentSimID: state.appState.get('currentSimSatellite'),
  satellites: state.appState.get('satellites'),
});

const mapDispatchToProps = dispatch => ({
  fetchSatelliteData: () => {
    dispatch(downloadSatelliteData());
  },
  fetchSatellites: () => {
    dispatch(getSatelliteIDs());
  },
});

export default withRoot(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(SatellitePredictions)
  )
);
