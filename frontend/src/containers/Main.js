import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import SatellitePredictions from './SatellitePredictions';
/*
import UploadData from './UploadData';
import Satellites from './Satellites';
*/

class Main extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={SatellitePredictions} />
        {/*
        <Route path='/satellites' component={Satellites}/>
        <Route path='/uploadData' component={UploadData}/>
       */}
      </Switch>
    );
  }
}

export default Main;
