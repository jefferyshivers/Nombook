import React from 'react';
// import { connect } from 'react-redux';
import { 
  Editor, 
  EditorState,
  convertFromRaw,
  convertToRaw } from 'draft-js';
import { Link } from 'react-router-dom';

import { Nombook as NB } from '../api';
import '../styles/components/RecipeTile.css'

const RecipeTile = props => {
  return(
    <div className="RecipeTile">
      <div className="author-and-title">
        Recipe Tile
      </div>
      <div className="image-container">
        image
      </div>
      <div className="statistics">
        statistics
      </div>
    </div>
  )
}

export default RecipeTile;