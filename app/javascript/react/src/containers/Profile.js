import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Editor, 
  EditorState,
  convertFromRaw,
  convertToRaw } from 'draft-js';
import { Link } from 'react-router-dom';

import RecipeTile from '../components/RecipeTile'
import { Nombook as NB } from '../api';
import '../styles/containers/Profile.css'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        username: null
      },
      recipes: []
    }
    this.loadUser = this.loadUser.bind(this)
  }
  componentWillMount() {
    this.loadUser()
  }

  loadUser() {
    const nb = new NB();
    
    nb.request('GET', `/users/${this.props.match.params.username}`, res => {
      if (res.user) {
        let recipes = res.recipes.map(recipe => {
          return Object.assign({}, recipe, {
            name: EditorState.createWithContent(convertFromRaw(JSON.parse(recipe.name))),
            description: EditorState.createWithContent(convertFromRaw(JSON.parse(recipe.description)))
          })
        })

        this.setState({
          user: res.user, 
          recipes: recipes
        })
      } else {
        this.props.history.push("/");
        console.log('Something went wrong while trying to load this profile.');
      }
    })
  }

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


    const edit_profile_or_save_button = (this.state.editing) ? (
      <div 
        className="edit-profile-or-save-button"
        onClick={() => {}}>
        save
      </div>
    ) : (
      <div 
        className="edit-profile-or-save-button"
        onClick={() => {}}>
        edit
      </div>
    )

    const edit_or_save_if_me = (this.props.current_user.username === this.props.match.params.username) ? edit_profile_or_save_button : null

    {/* meta card 
        Profile stuff: picture, name, following, followers, 
    */}
    const meta = (
      <div className="meta">
        
        <div className="picture-and-name">
          {/* picture */}
          <div className="picture-container">
            <div className="picture">
              profile picture
            </div>
          </div>
          {/* name */}
          <div className="name-container">
              username
          </div>

          {edit_or_save_if_me}
        </div>
        
        <div className="description-and-statistics">
          {/* description */}
          <div className="description">
            description goes here
          </div>

          {/* statistics */}
          <div className="statistics">
            <div className="button">3 recipes</div>
            <div className="button">14 followers</div>
            <div className="button">0 following</div>
          </div>

        </div>
      </div>
    )

    {/* recipe tiles */}
    const recipes = this.state.recipes.map(recipe => {
      return(
        <RecipeTile 
          key={recipe.id}
          id={recipe.id}
          photo_url={recipe.photo.url}
          username={this.state.user.username}
          name={recipe.name}/>
      )
    })

    return(
      <div className='Profile'>
        {control_panel}
        {meta}
        {recipes}
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
