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
    const control_panel = (this.props.current_user.username !== this.props.match.params.username) ? (
      <div className="control-panel">
        <div className="relationship-container">
          Control panel (edit account, follow user, "You have 5 forks in common."). 
          This will stick to the top of the page.
        </div>
        <div className="meta-button-group">
          <div 
            className="button">
            follow
          </div>

        </div>
      </div>
    ) : null

    {/* meta card */}
    const meta = (
      <div className="meta">
        Profile stuff: picture, name, following, followers, 

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

const mapStateToProps = state => {
  return {
    current_user: state.current_user
  }
};

export default connect(
  mapStateToProps,
  null
)(Profile);
