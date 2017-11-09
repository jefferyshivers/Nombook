import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../styles/containers/About.css'

class About extends Component {
  render() {
    return(
      <div className='About'>
        <div className="nombook">
          <Link to="/">nombook</Link>
        </div>
  
        <Link to="/" className="logo">hi</Link>

        <div>
          description here...
        </div>
      </div>
    )
  }
}

export default About;