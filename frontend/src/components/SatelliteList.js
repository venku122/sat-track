import React, { Component } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

class SatelliteList extends Component {

  render() {
    const { satellites } = this.props;
    const smallSatellites = satellites.slice(0, 50);
    return (
      <List>
        {smallSatellites.map(satelllite => (
          <ListItem key={`item-${satelllite.get('id')}`}>
            <ListItemText primary={`${satelllite.get('name')}`} />
          </ListItem>
        ))}
      </List>
      );
  }
}

export default SatelliteList;
