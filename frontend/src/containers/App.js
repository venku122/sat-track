import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { connectSocket } from '../actions/actions';
import Header from './Header';
import Main from './Main';

class App extends Component {
  
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Header />
        <Main />
      </div>
    );
  }
}

export default withRouter(connect(null)(App));
