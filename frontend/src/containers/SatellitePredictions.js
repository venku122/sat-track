import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import SatelliteMap from '../components/SatelliteMap';
import SatelliteList from '../components/SatelliteList';
import withRoot from '../withRoot';
import {
  downloadSatelliteData,
  getSatelliteIDs
} from '../actions/actions';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
});

class SatellitePredictions extends React.Component {
  componentDidMount() {

  }

  handleClick = () => {
    const { fetchSatelliteData, fetchSatellites } = this.props;
    //fetchSatelliteData();
    fetchSatellites();
  };

  render() {
    const { classes, simData, satellites } = this.props;

    return (
      <div className={classes.root}>
        <SatelliteMap predictions={simData}/>
        <SatelliteList satellites={satellites} />
        <Button variant="contained" color="secondary" onClick={this.handleClick}>
          Fetch Satellite Data
        </Button>
      </div>
    );
  }
}

SatellitePredictions.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchSatelliteData: PropTypes.func.isRequired,
  simData: PropTypes.object,
  currentSimID: PropTypes.string,
  satellites: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  return {
    simData: state.appState.get('simData'),
    currentSimID: state.appState.get('currentSimSatellite'),
    satellites: state.appState.get('satellites'),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchSatelliteData: () => {
      dispatch(downloadSatelliteData())
    },
    fetchSatellites: () => {
      dispatch(getSatelliteIDs());
    },
  };
};

export default withRoot(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SatellitePredictions)));
