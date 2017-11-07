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
    this.toggleFocusUserIcon = this.toggleFocusUserIcon.bind(this)
    this.toggleSearchBar = this.toggleSearchBar.bind(this)
  }

  toggleFocusUserIcon() {
    this.setState({
      user_icon_focused: !this.state.user_icon_focused
    })
  }

  toggleSearchBar() {
    this.setState({
      search_focused: !this.state.search_focused
    })
  }

  handleChangeQuery(e) {
    let query = e.target.value
    this.props.onChangeQuery(query)
    // set true again as a fallback, in case it isn't focused for some reason (this is a QA thing)
    this.setState({search_focused: true})

    if (query !== "") {
      let nb = new NB();

      nb.request('GET', `/search/${query}`, res => {
        this.props.onUpdateResults(res.results)
      })
    } else {
      this.props.onUpdateResults({
        users: [],
        recipes: []
      })
    }
  }

  render() {
    const user_style = (this.state.user_icon_focused) ? {
      background: "gray"
    } : null

    {/* home */}
    const home = (
      <div className="home">
        <Link to="/">
          nombook
        </Link>
      </div>
    )

    {/* search */}
    const search_results_list = (this.props.search.results.users.length > 0) ? 
      this.props.search.results.users.map(user => {
        const background = (user.profile_photo) ? {
          backgroundImage: `url(${user.profile_photo.url})`,
          backgroundSize: 'cover'
        } : null
        return (
          <Link 
            to={`/users/${user.username}`} 
            onClick={this.props.onClearSearch}
            key={user.id} 
            className="user-container">
            <div className="icon-container">
              <div className="icon" style={{}}></div>
            </div>
            <div className="username-container">
              {user.username}
            </div>
          </Link>
        )
      }) : (
      <div className="user-container">No results</div>
    )
    const search_results = (this.props.search.query !== "") ? (
      <div className="search-results">
        <div className="inner" onClick={this.toggleSearchBar}>
          {search_results_list}
        </div>
      </div>
    ) : null
    const search = (
      <div 
        className="search">
        <input 
          placeholder="Search"
          className="inner" 
          value={this.props.search.query}
          onClick={() => {this.setState({search_focused: true})}}
          onChange={this.handleChangeQuery}/>
        {search_results}
      </div>
    )

    {/* user */}
    const icon = (this.props.current_user.profile_photo) ? {
      backgroundImage: `url(${this.props.current_user.profile_photo.url})`,
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
          +
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
