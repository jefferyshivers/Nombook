import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../styles/containers/PublicHomePage.css'

class PublicHomePage extends Component {
  render() {
    return(
      <div className='PublicHomePage'>
        <div>Nombook</div>

        <Link to="/about">About</Link>

        <div>
          <a href="/users/sign_in">Login</a>
          <a href="/users/sign_up">Sign Up</a>
        </div>
      </div>
    )
  }
}

export default PublicHomePage;