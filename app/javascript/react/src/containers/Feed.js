import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { 
  Editor, 
  EditorState,
  convertFromRaw,
  convertToRaw } from 'draft-js';
import { Link } from 'react-router-dom';

import RecipeTile from '../components/RecipeTile'
import { Nombook as NB } from '../api';
import '../styles/containers/Feed.css'

class Feed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      feed: {
        recipes: []
      }
    }
  }
  componentDidMount() {
    this.loadFeed()
  }

  loadFeed() {
    const nb = new NB();
    
    nb.request('GET', `/users/${this.props.match.params.username}/feed`, res => {
      if (res.feed) {
        let recipes = res.feed.recipes.map((recipe, index) => {
          return Object.assign({}, recipe, {
            name: EditorState.createWithContent(convertFromRaw(JSON.parse(recipe.name))),
            description: EditorState.createWithContent(convertFromRaw(JSON.parse(recipe.description))),
            forks: res.feed.forks_likes[index].forks,
            likes: res.feed.forks_likes[index].likes,
            profile_thumb_url: res.feed.profiles[index].thumb_url,
            username: res.feed.profiles[index].username
          })
        })

        this.setState({
          feed: Object.assign({}, res.feed, {
            recipes: recipes
          })
        })
      } else {
        this.props.history.push("/");
        console.log('Something went wrong while trying to load this feed.');
      }
    })
  }

  render() {
    const feed = this.state.feed.recipes.map(recipe => {
      return(
        <RecipeTile 
          key={recipe.id}
          id={recipe.id}
          photo_url={recipe.photo.url}
          profile_photo_url={recipe.profile_thumb_url}
          username={recipe.username}
          name={recipe.name}
          forks={recipe.forks}
          likes={recipe.likes}/>
      )
    })

    return(
      <div className='Feed'>
        {feed}
      </div>
    )
  }
}

export default Feed;