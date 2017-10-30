import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';
// import { navigateFeed } from '../actions/navigate'

import '../styles/containers/NavBar.css'

class NavBar extends Component {
  componentWillMount() {
    // this.props.navigate()
  }

  render() {
    return(
      <div className='NavBar'>
        <Link to="/users/1">user</Link>
        ...
        <Link to="/recipes/1">recipe</Link>
        ...
        <Link to="/">feed</Link>
      </div>
    )
  }
}

export default NavBar;