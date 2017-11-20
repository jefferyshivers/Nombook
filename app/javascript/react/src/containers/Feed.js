import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  Editor, 
  EditorState,
  convertFromRaw,
  convertToRaw } from 'draft-js';
import { Link } from 'react-router-dom';
import { sendView } from '../actions/activities';

import RecipeTile from '../components/RecipeTile'
import { Nombook as NB } from '../api/index';
import '../styles/containers/Feed.scss'

class Feed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      feed: {
        recipes: [],
        offset: 0
      },
      loadingFeed: true,
      reachedEnd: false
    }
    this.handleScroll = this.handleScroll.bind(this);
    this.getRandomRecipe = this.getRandomRecipe.bind(this);
  }
  componentDidMount() {
    this.props.onView('/')
    this.loadFeed(0)
    document.getElementById('Nombook').addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    document.getElementById('Nombook').removeEventListener("scroll", this.handleScroll);
  }

  getRandomRecipe() {
    const nb = new NB();
    
    nb.request('GET', `/recipes/random`, res => {
      if (res.random_recipe_id) {
        this.props.history.push(`/recipes/${res.random_recipe_id}`);
      } else {
        this.props.history.push("/");
        console.log('Something went wrong while trying to load your random recipe.');
      }
    })
  }

  handleScroll() {
    let nombook = document.getElementById('Nombook')
    let main = document.getElementById('main')
    
    let nombookHeight = nombook.offsetHeight;
    let mainHeight = main.offsetHeight;
    let mainTop = main.getBoundingClientRect().top;
    let scrolled = (mainTop * -1) + nombookHeight;

    let reachedBottom = (scrolled >= mainHeight);
    if (!this.state.loadingFeed && !this.state.reachedEnd && reachedBottom) {
      this.setState({loadingFeed: true})
      this.loadFeed(parseInt(this.state.feed.offset) + 1)
    }
  }

  loadFeed(offset) {
    const nb = new NB();
    
    nb.request('GET', `/users/${this.props.match.params.username}/feed/${offset}`, res => {
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

        let reachedEnd = (recipes.length < 10)

        this.setState({
          feed: Object.assign({}, res.feed, {
            recipes: this.state.feed.recipes.concat(recipes)
          }),
          loadingFeed: false,
          reachedEnd: reachedEnd
        })
      } else {
        this.props.history.push("/");
        console.log('Something went wrong while trying to load this feed.');
      }
    })
  }

  render() {
    const loading_more = (
      <div className="loading-card">
        Loading recipes...
      </div>
    )

    const end_of_feed = (
      <div className="loading-card" onClick={this.getRandomRecipe}>
        <div>You have reached the end of your feed.</div>
        <div className="party">🎉</div>
        <div>Still want more? Click to view a random recipe.</div>
      </div>
    )

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
        {(this.state.reachedEnd) ? end_of_feed : loading_more}
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onView: (view) => {
      dispatch(sendView(view))
    }
  }
};

export default connect(
  null,
  mapDispatchToProps
)(Feed);