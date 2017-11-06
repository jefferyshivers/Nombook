import React from 'react';
import { 
  Editor, 
  EditorState,
  convertFromRaw,
  convertToRaw } from 'draft-js';
import { Link } from 'react-router-dom';

import { Nombook as NB } from '../api';
import '../styles/components/RecipeTile.css'


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

const statistics = (forks, likes, id) => {
  return(
    <Link to={`/recipes/${id}`} className="statistics">
      <div className="button">
        <i className="material-icons">call_split</i>
        {forks}
      </div>
      <div className="button">
        <i className="material-icons">favorite_border</i>
        {likes}
      </div>
    </Link>
  )
}

const RecipeTile = props => {
  return(
    <div className="RecipeTile">
      {author_and_title(props.profile_photo_url, props.username, props.name, props.id)}
      {photo(props.photo_url, props.id)}
      {statistics(props.forks, props.likes, props.id)}
    </div>
  )
}

export default RecipeTile;