import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import '../styles/Header.css';

class Header extends Component {

  render() {

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
          <Typography className="header-title " variant="title" color="inherit" >
              Sat-Track
          </Typography>
          {/*
          <div className="header-links">
            <Link className="header-link-item" to='/'>
              <Typography variant="button"  color="inherit">
                Barrels
              </Typography>
            </Link>
            <Link className="header-link-item" to='/satellites'>
              <Typography variant="button"  color="inherit">
                Satellites
              </Typography>
            </Link>
            <Link className="header-link-item" to='/uploadData'>
              <Typography variant="button"  color="inherit">
                Upload Data
              </Typography>
            </Link>
          </div>
          */}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default Header;