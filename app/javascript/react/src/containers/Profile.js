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
        profile_photo: null,
        original_profile_photo: null,
        followers: [],
        following: [],
        current_user_following: null
      },
      recipes: []
    }
    this.loadUser = this.loadUser.bind(this)
    this.saveUpdatedProfile = this.saveUpdatedProfile.bind(this)
    this.cancelUpdateProfile = this.cancelUpdateProfile.bind(this)
    this.handleChangeDescription = this.handleChangeDescription.bind(this)
    this.mountPhoto = this.mountPhoto.bind(this)
    this.handleFollow = this.handleFollow.bind(this)
    this.handleUnfollow = this.handleUnfollow.bind(this)
  }
  componentWillMount() {
    this.loadUser()
  }

  loadUser() {
    const nb = new NB();
    
    nb.request('GET', `/users/${this.props.match.params.username}`, res => {
      if (res.user) {
        let recipes = res.recipes.map((recipe, index) => {
          return Object.assign({}, recipe, {
            name: EditorState.createWithContent(convertFromRaw(JSON.parse(recipe.name))),
            description: EditorState.createWithContent(convertFromRaw(JSON.parse(recipe.description))),
            forks: res.forks_likes[index].forks,
            likes: res.forks_likes[index].likes
          })
        })

        let description = (res.user.description) ? EditorState.createWithContent(convertFromRaw(JSON.parse(res.user.description))) : EditorState.createEmpty()

        let user = Object.assign({}, res.user, {
          description: description,
          profile_photo: res.profile_photo,
          original_profile_photo: res.profile_photo,
          followers: res.followers,
          following: res.following,
          current_user_following: res.current_user_following
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
    }
    if (this.state.user.profile_photo) {
      body.profile_photo = this.state.user.profile_photo
    }
    let params = {
      method: 'PATCH',
      body: JSON.stringify(body)
    }

    nb.request(params, `/users/${this.state.user.id}`, res => {
      if (res.saved) {
        let description = EditorState.createWithContent(convertFromRaw(JSON.parse(res.user.description)))

        this.setState({
          user: Object.assign({}, this.state.user, {
            description: description,
            profile_photo: res.profile_photo,
            original_profile_photo: res.profile_photo
          }),
          editing: false
        })
      } else {
        console.log('Something went wrong here.')
      }
    })
  }

  cancelUpdateProfile() {
    this.setState({
      editing: false, 
      user: Object.assign({}, this.state.user, {
        profile_photo: this.state.user.original_profile_photo        
      })
    })
  }

  handleChangeDescription(editorState) {
    this.setState({
      user: Object.assign({}, this.state.user, {
        description: editorState
      })
    })
  }

  handleFollow() {
    const nb = new NB();

    let body = {
      followed_id: this.state.user.id,
    }

    let params = {
      method: 'PATCH',
      body: JSON.stringify(body)
    }

    nb.request(params, `/follows/${this.props.current_user.id}`, res => {
      if (res.saved) {
        this.setState({
          user: Object.assign({}, this.state.user, {
            current_user_following: res.current_user_following,
            followers: res.followers
          })
        })
      } else {
        console.log('Something went wrong here.')
      }
    })
  }

  handleUnfollow() {
    const nb = new NB();

    let body = {
      followed_id: this.state.user.id,
    }

    let params = {
      method: 'DELETE',
      body: JSON.stringify(body)
    }

    nb.request(params, `/follows/${this.props.current_user.id}`, res => {
      if (res.saved) {
        this.setState({
          user: Object.assign({}, this.state.user, {
            current_user_following: res.current_user_following,
            followers: res.followers
          })
        })
      } else {
        console.log('Something went wrong here.')
      }
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
    const follow_or_unfollow_button = (this.state.user.current_user_following) ? (
      <div 
        className="button"
        onClick={this.handleUnfollow}>
        following
      </div>
    ) : (
      <div 
        className="button"
        onClick={this.handleFollow}>
        follow
      </div>
    )
    const control_panel = (this.props.current_user.username !== this.props.match.params.username) ? (
      <div className="control-panel">
        <div className="relationship-container">
          Control panel (edit account, follow user, "You have 5 forks in common."). 
          This will stick to the top of the page.
        </div>
        <div className="meta-button-group">
          {follow_or_unfollow_button}
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
    const cancel_edits = (this.state.editing) ? (
      <div 
        title="Cancel edits"
        className="cancel-profile-edits"
        onClick={this.cancelUpdateProfile}>
        cancel
      </div>
    ) : null

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
                      <i className="material-icons">photo_camera</i>
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
          {cancel_edits}
        </div>
        
        <div className="description-and-statistics">
          {/* description */}
          <div className={(this.state.editing) ? "description editing" : "description"}>
            <Editor 
              spellCheck={true}
              readOnly={!this.state.editing}
              editorState={this.state.user.description} 
              onChange={(e) => {this.handleChangeDescription(e)}} />
          </div>

          {/* statistics */}
          <div className="statistics">
            <div className="button">{`${this.state.recipes.length} recipes`}</div>
            <div className="button">{`${this.state.user.followers.length} followers`}</div>
            <div className="button">{`${this.state.user.following.length} following`}</div>
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
          name={recipe.name}
          forks={recipe.forks}
          likes={recipe.likes}/>
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
