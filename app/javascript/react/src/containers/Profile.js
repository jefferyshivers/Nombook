import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Editor, 
  EditorState,
  convertFromRaw,
  convertToRaw } from 'draft-js';
import { Link } from 'react-router-dom';

import ReactFileReader from 'react-file-reader';
import RecipeTile from '../components/RecipeTile'
import { Nombook as NB } from '../api';
import '../styles/containers/Profile.css'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        username: null,
        description: EditorState.createEmpty(),
        profile_photo: null
      },
      recipes: [],
    }
    this.loadUser = this.loadUser.bind(this)
    this.saveUpdatedProfile = this.saveUpdatedProfile.bind(this)
    this.handleChangeDescription = this.handleChangeDescription.bind(this)
    this.mountPhoto = this.mountPhoto.bind(this)
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

        let description = (res.user.description) ? EditorState.createWithContent(convertFromRaw(JSON.parse(res.user.description))) : EditorState.createEmpty()

        let user = Object.assign({}, res.user, {
          description: description,
          profile_photo: res.profile_photo
        })

        this.setState({
          user: user, 
          recipes: recipes
        })
      } else {
        this.props.history.push("/");
        console.log('Something went wrong while trying to load this profile.');
      }
    })
  }

  saveUpdatedProfile() {
    const nb = new NB();

    let body = {
      description: JSON.stringify(convertToRaw(this.state.user.description.getCurrentContent())),
      profile_photo: this.state.user.profile_photo
    }
    let params = {
      method: 'PATCH',
      body: JSON.stringify(body)
    }

    nb.request(params, `/users/${this.state.user.id}`, res => {
      if (res.saved) {
        let user = Object.assign({}, res.user, {
          description: EditorState.createWithContent(convertFromRaw(JSON.parse(res.user.description))),
        })
        this.setState({user: user, editing: false})
      } else {
        console.log('Something went wrong here.')
      }
    })
  }

  handleChangeDescription(editorState) {
    this.setState({
      user: Object.assign({}, this.state.user, {
        description: editorState
      })
    })
  }

  mountPhoto(file) {
    this.setState({
      user: Object.assign({}, this.state.user, {
        profile_photo: file.base64        
      })
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
        title="Edit profile"
        className="edit-profile-or-save-button"
        onClick={this.saveUpdatedProfile}>
        save
      </div>
    ) : (
      <div 
        title="Save changes"
        className="edit-profile-or-save-button"
        onClick={() => {this.setState({editing: true})}}>
        edit
      </div>
    )

    const edit_or_save_if_me = (this.props.current_user.username === this.props.match.params.username) ? edit_profile_or_save_button : null
    const account_settings_button = (this.props.current_user.username === this.props.match.params.username) ? (
      <a 
        href="/users/edit"
        title="Edit your account"
        className="account-settings-button"
        onClick={this.saveUpdatedProfile}>
        <i className="material-icons">settings</i>
      </a>
    ) : null


    {/* meta card 
        Profile stuff: picture, name, following, followers, 
    */}
    const background = (this.state.user.profile_photo) ? {
      backgroundImage: `url(${this.state.user.profile_photo})`,
      backgroundSize: 'cover'
    } : null

    const meta = (
      <div className="meta">
        
        <div className="picture-and-name">
          {/* picture */}
          <div className="picture-container">
            <div className="picture" style={background}>
              {(this.state.editing) ? (
                <div className="upload-new-photo">

                  <ReactFileReader 
                    fileTypes={[".png",".jpg",".jpeg"]} 
                    base64={true} multipleFiles={false} 
                    handleFiles={this.mountPhoto}>
                    <button className='upload-photo-button'>
                      {(this.state.profile_photo) ? "Change Photo" : "Upload Photo"}
                    </button>
                  </ReactFileReader>

                </div>
              ) : null}
            </div>
          </div>

          {/* name */}
          <div className="name-container">
            {this.state.user.username}
          </div>

          {edit_or_save_if_me}
        </div>
        
        <div className="description-and-statistics">
          {/* description */}
          <div className="description">
            <Editor 
              spellCheck={true}
              readOnly={!this.state.editing}
              editorState={this.state.user.description} 
              onChange={(e) => {this.handleChangeDescription(e)}} />
          </div>

          {/* statistics */}
          <div className="statistics">
            <div className="button">3 recipes</div>
            <div className="button">14 followers</div>
            <div className="button">0 following</div>
          </div>
        </div>

        {account_settings_button}
      </div>
    )

    {/* recipe tiles */}
    const recipes = this.state.recipes.map(recipe => {
      return(
        <RecipeTile 
          key={recipe.id}
          id={recipe.id}
          profile_photo_url={this.state.user.profile_photo}
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
