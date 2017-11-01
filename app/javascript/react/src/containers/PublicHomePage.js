import React, { Component } from 'react';

// import '../styles/containers/PublicHomePage.css'

import LoginForm from '../components/LoginForm'

class PublicHomePage extends Component {
  render() {
    return(
      <div className='PublicHomePage'>
        <div>welcome to nombook</div>
        <div>
          <a href="/users/sign_in">Login</a>
          <a href="/users/sign_up">Sign Up</a>
        </div>
      </div>
    )
  }
}

export default PublicHomePage;