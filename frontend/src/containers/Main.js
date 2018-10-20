import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SatelliteMap from './SatelliteMap';
/*
import UploadData from './UploadData';
import Satellites from './Satellites';
*/

class Main extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={SatelliteMap}/>
        {/*
        <Route path='/satellites' component={Satellites}/>
        <Route path='/uploadData' component={UploadData}/>
       */ }
      </Switch>
    );
  }
}

export default Main;
