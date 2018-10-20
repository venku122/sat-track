import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import SatelliteMap from '../components/SatelliteMap';
import withRoot from '../withRoot';
import { downloadSatelliteData } from '../actions/actions';

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
    const { fetchSatelliteData } = this.props;
    fetchSatelliteData();
  };

  render() {
    const { classes, satelliteData } = this.props;

    return (
      <div className={classes.root}>
        <SatelliteMap predictions={satelliteData}/>
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
  satelliteData: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  return {
    satelliteData: state.appState.get('satelliteData'),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchSatelliteData: () => {
      dispatch(downloadSatelliteData())
    },
  };
};

export default withRoot(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SatellitePredictions)));
