import React from 'react';
import { 
  Editor, 
  EditorState,
  convertFromRaw,
  convertToRaw } from 'draft-js';
import { Link } from 'react-router-dom';

import { Nombook as NB } from '../api';
import '../styles/components/ProfileTile.scss'


const author_and_title = (profile_photo_url, username, name, id) => {
  const profile_avatar = (profile_photo_url) ? {
    backgroundImage: `url(${profile_photo_url})`,
    backgroundSize: 'cover'
  } : null

  return(
    <div className="author-and-title-container">
      <div className="author-and-title">
        <div className="author">
          <div className="profile-photo-container">
            <Link to={`/users/${username}`} className="photo" style={profile_avatar}></Link>
          </div>
          <div 
            className="username">
            <Link to={`/users/${username}`}>
              {username}
            </Link>
          </div>
        </div>
        <Link to={`/recipes/${id}`} className="title">
          <Editor 
            spellCheck={false}
            readOnly={true}
            editorState={name} 
            onChange={() => {}} />
        </Link>
      </div>
    </div>
  )
}

const photo = (photo_url, id) => {
  const background = (photo_url) ? {
    backgroundImage: `url(${photo_url})`,
    backgroundSize: 'cover'
  } : null

  return(
    (photo_url) ? (
      <Link to={`/recipes/${id}`} className="image-container">
        <div className="photo" style={background}></div>
      </Link>
    ) : null
  )
}


const ProfileTile = props => {
  const background = (props.user.profile_photo.thumb) ? {
    backgroundImage: `url(${props.user.profile_photo.thumb.url})`,
    backgroundSize: 'cover'
  } : null

  return(
    <div className="ProfileTile">
      <div className="inner">
        <div className="icon-container">
          <div className="icon" style={background}>
          </div>
        </div>
        <Link 
          to={`/users/${props.user.username}`}
          className="username">{props.user.username}
        </Link>
      </div>
    </div>
  )
}

export default ProfileTile;