import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { sendView } from '../actions/activities';

import '../styles/containers/About.scss'

class About extends Component {
  componentDidMount() {
    this.props.onView('about')
  }

  render() {
    const description = (
      <div className='colored-card'>
        <p>
          Nombook is the social recipe manager that makes your experience
          creating, sharing and discovering recipes simple and fun.
        </p>
        <div className="mockups">
          <div className="img-container">
            <img src={`${require('../../../../../app/assets/images/mockup-editor/flat.png')}`}/>
          </div>
          <div className="img-container">
            <img src={`${require('../../../../../app/assets/images/mockup-feed/tilted-right.png')}`}/>
          </div>
          <div className="img-container"></div>
        </div>
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
          Forks allow you to take any recipe (made by you or someone else) and
          make the changes you want to make it your own!
        </p>
        <div className="heading icon">
          <i className="material-icons">call_split</i>
        </div>
        <p>
          We add a button to your new recipe which leads back to the 
          original recipe that inspired it.
        </p>
        <div className="heading fork-example">
          <div className="button">
            <div className="forked-from">Forked from</div>
            <div className="recipe-name">Blueberry Pie</div>
          </div>
        </div>
        <p>
          You don't have to worry if the original recipe is changed or deleted, 
          it won't affect your new one.
        </p>
      </div>
    )

    const logo = {
      backgroundImage: `url(${require('../../../../../app/assets/images/logo_with_white_bg.png')})`,
      backgroundSize: 'cover'
    }

    return(
      <div className='About'>
        <div className='card'>
          <Link to="/" className="logo" style={logo}></Link>
          <div className="title">
            Welcome to nombook
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

const mapDispatchToProps = dispatch => {
  return {
    onView: (view) => {
      dispatch(sendView(view))
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(About);
