import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { changeQuery, updateResults, clearSearch } from '../actions/search'

import { Nombook as NB } from '../api';
import '../styles/containers/NavBar.css'

class NavBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user_icon_focused: false,
      search_focused: false
    }
    this.handleChangeQuery = this.handleChangeQuery.bind(this)
    this.handleClickSearchIcon = this.handleClickSearchIcon.bind(this)
  }

  handleChangeQuery(e) {
    let query = e.target.value
    this.props.onChangeQuery(query)
    // set true again as a fallback, in case it isn't focused for some reason (this is a QA thing)
    this.setState({search_focused: true, results_loaded: false})

    if (query !== "") {
      let nb = new NB();

      nb.request('GET', `/search/${query}`, res => {
        this.props.onUpdateResults(res.results)
        this.setState({results_loaded: true})
      })
    } else {
      this.props.onUpdateResults({
        users: [],
        recipes: []
      })
    }
  }

  handleClickSearchIcon(){
    this.searchInput.focus();
  }

  render() {
    const user_style = (this.state.user_icon_focused) ? {
      background: "gray"
    } : null

    {/* home */}
    const home = (
      <div className="home">
        <Link to="/" className="link" title="Nombook">
          <div className="icon">
            <div className="inner"></div>
          </div>
          <div className="title">
            nombook          
          </div>
        </Link>
      </div>
    )

    {/* search */}
    const search_results_list = (this.props.search.results.users.length > 0) ? 
      this.props.search.results.users.map(user => {
        const background = (user.profile_photo) ? {
          backgroundImage: `url(${user.profile_photo.thumb.url})`,
          backgroundSize: 'cover'
        } : null
        return (
          <div 
            onClick={this.props.onClearSearch}
            key={user.id} 
            className="user-container">
            <Link to={`/users/${user.username}`}  className="icon-container">
              <div className="icon" style={background}></div>
            </Link>
            <Link to={`/users/${user.username}`}  className="username-container">
              {user.username}
            </Link>
          </div>
        )
      }) : (
      <div className="user-container">No results</div>
    )
    const search_results = (this.state.results_loaded && this.props.search.query !== "") ? (
      <div className="search-results">
        <div className="inner" onClick={this.toggleSearchBar}>
          {search_results_list}
        </div>
      </div>
    ) : null
    const search = (
      <div className={(this.state.search_focused) ? "search full-small-screen-width" : "search"}>
        <div className="icon-container">
          <div title="Search" className={(this.state.search_focused) ? "icon hide-on-input-focused" : "icon"} onClick={this.handleClickSearchIcon}>
            <i className="material-icons">search</i>
          </div>
        </div>
        <input 
          placeholder="Search"
          className="inner" 
          type="text"
          ref={(input) => { this.searchInput = input; }} 
          value={this.props.search.query}
          onFocus={() => {this.setState({search_focused: true})}}
          onBlur={() => {this.setState({search_focused: false})}}
          onChange={this.handleChangeQuery}/>
        {search_results}
      </div>
    )

    {/* user */}
    const icon = (this.props.current_user.profile_photo) ? {
      backgroundImage: `url(${this.props.current_user.profile_photo.medium.url})`,
      backgroundSize: 'cover'
    } : {
      background: 'red'
    }
    const user = (
      <div className="user">
        <Link to={`/users/${this.props.current_user.username}`} className="icon" style={icon}>
          {(this.props.current_user.profile_photo) ? null : "u"}
        </Link>
      </div>
    )

    {/* add a recipe */}
    const add_a_recipe = (
      <div className="add">
        <Link to="/recipes/new" className="icon">
          <i className="material-icons">add</i>
        </Link>
      </div>
    )

    return(
      <div className='NavBar'>
        <div className="inner">
          {home}
          {search}
          {add_a_recipe}
          {user}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    current_user: state.current_user,
    search: state.search
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeQuery: (query) => {
      dispatch(changeQuery(query))
    },
    onUpdateResults: (results) => {
      dispatch(updateResults(results))
    },
    onClearSearch: () => {
      dispatch(clearSearch())
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar);
