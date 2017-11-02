import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Editor, 
  EditorState,
  convertFromRaw,
  convertToRaw } from 'draft-js';
import { Link } from 'react-router-dom';

import '../styles/containers/Profile.css'

class Profile extends Component {
  componentWillMount() {
    // this.props.navigate()
  }

  
  // renders recipe with "id"; if id is 'new', then initializes with either preset defaults
  // (i.e. example title, steps, etc.) or with inherited body from fork

  render() {
    {/* control panel */}
    const control_panel = (
      <div className="control-panel">
        <div className="style-button-group"></div>
        <div className="meta-button-group">
          <div 
            className="button">
            Save
          </div>

        </div>
      </div>
    )

    {/* meta card */}
    const meta = (
      <div className="meta">

        {/* name */}
        <div className="name">
        </div>

        {/* author */}
        <div className="author">
        </div>
        
        {/* description */}
        <div className="description">
        </div>
      </div>
    )


    return(
      <div className='Profile'>
        {control_panel}
        {meta}
      </div>
    )
  }
}

export default Profile;