import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { navigateFeed } from '../actions/navigate'

// import '../styles/containers/Recipe.css'

class Recipe extends Component {
  componentWillMount() {
    // this.props.navigate()

  }

  // renders recipe with "id"; if id is 'new', then initializes with either preset defaults
  // (i.e. example title, steps, etc.) or with inherited body from fork

  render() {
    return(
      <div className='Recipe'>
        recipe with id = {this.props.match.params.id}
      </div>
    )
  }
}

export default Recipe;