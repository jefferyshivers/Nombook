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
    const user_style = (this.state.user_icon_focused) ? {
      background: "gray"
    } : null

    {/* home */}
    const home = (
      <div className="home">
        <Link to="/">
          nombook
        </Link>
      </div>
    )

    {/* search */}
    const search = (
      <div className="search">
        <div className="inner">
          search
        </div>
      </div>
    )

    {/* user */}
    const user = (
      <div className="user" style={user_style}>
        <Link to={`/users/${this.props.current_user.username}`} className="icon">
          u
        </Link>
      </div>
    )

    // <button
    //   className="icon"
    //   onClick={() => {this.toggleFocusUserIcon()}}
    //   onBlur={() => {if (this.state.user_icon_focused) {this.toggleFocusUserIcon()}}}>
    //   {(this.props.current_user.avatar) ? <i className="material-icons">account_circle</i> : <i className="material-icons">account_circle</i> }            
    // </button>

    {/* add a recipe */}
    const add_a_recipe = (
      <div className="add">
        <Link to="/recipes/new" className="icon">
          +
        </Link>
      </div>
    )

    return(
      <div className='NavBar'>
        <div className="inner">
          {home}
          {search}
          {add_a_recipe}
          {user}
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