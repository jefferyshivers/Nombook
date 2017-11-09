import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import '../styles/containers/About.css'

class About extends Component {

  render() {
    const description = (
      <div className='colored-card'>
        <p>
          Nombook is the social recipe manager that makes your experience
          creating, sharing and discovering recipes simple and fun.
        </p>
        <hr/>
        <div className="heading icon">
          <i className="material-icons">create</i>
        </div>
        <p>
          Create new recipes using rich text (bold, italic, etc),
          inline emojis, and photos (still images as well as GIF's) to 
          completely customize the look of your recipe.
        </p>
        <div className="heading icon">
          <i className="material-icons">search</i>
        </div>        
        <p>
          Search for friends, and follow those whose recipes you want to 
          keep track of.
        </p>
        <div className="heading icon">
          <i className="material-icons">people</i>
        </div>        
        <p>
          View anyone's
          page to see your relationship with them - that's how many <i>forks</i>,
          likes and friends you have in common.
        </p>
      </div>
    )

    const auth_links = (!this.props.current_user.username) ? (
      <div className="colored-card auth">
        <a href="/users/sign_in">Login</a>
        <a href="/users/sign_up">Sign up</a>
      </div>
    ) : null

    const forking = (
      <div className="card">
        <p className="heading">
          What's forking?
        </p>
        <hr/>
        <p>
          Forks allow you to take another recipe (made by you or anyone else) and
          make the changes you want into a new recipe!
        </p>
        <div className="heading icon">
          <i className="material-icons">call_split</i>
        </div>
        <p>
          We add a button to your recipe which leads back to the recipe 
          original recipe that inspired it.
        </p>
        <p>
          You don't have to worry if the original recipe is changed or deleted, 
          it won't affect your new one.
        </p>
      </div>
    )

    return(
      <div className='About'>
        <div className='card'>
          <Link to="/" className="logo"></Link>
          <div className="title">
            Welcome to Nombook
          </div>
        </div>
        {auth_links}
        {description}
        {forking}
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
)(About);
