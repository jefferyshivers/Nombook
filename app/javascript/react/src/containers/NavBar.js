import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// import { navigateFeed } from '../actions/navigate'

import '../styles/containers/NavBar.css'

class NavBar extends Component {
  constructor(props) {
    super(props)
    this.toggleFocusUserIcon = this.toggleFocusUserIcon.bind(this)
    this.state = {
      user_icon_focused: false
    }
  }

  toggleFocusUserIcon() {
    this.setState({
      user_icon_focused: !this.state.user_icon_focused
    })
    console.log('hi')
  }

  render() {
    const user_style = (this.state.user_icon_focused) ? ({
      background: "gray"
    }) : null



    return(
      <div className='NavBar'>
        <div className="inner">

          {/* home */}
          <div className="home">
            <Link to="/">
              Home
            </Link>
          </div>

          {/* search */}
          <div className="search">
            <div className="inner">
              search
            </div>
          </div>


          {/* user */}
          <div className="user" style={user_style}>

            <button
              className="icon"
              onClick={() => {this.toggleFocusUserIcon()}}
              onBlur={() => {if (this.state.user_icon_focused) {this.toggleFocusUserIcon()}}}>
              {(this.props.current_user.avatar) ? <i className="material-icons">account_circle</i> : <i className="material-icons">account_circle</i> }            
            </button>

          </div>

          {/* add a recipe */}
          <div className="add">
            <Link to="/recipes/new">
              +
            </Link>
          </div>
          
        </div>
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
)(NavBar);



// <Link to="/users/1">user</Link>
// ...
// <Link to="/recipes/1">recipe</Link>
// ...
// <Link to="/">feed</Link>
// ...
// <a href="/logout">sign out</a>
// ...