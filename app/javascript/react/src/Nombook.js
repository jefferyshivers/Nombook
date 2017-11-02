import React, { Component } from 'react';
import { connect } from 'react-redux';
import { 
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import NavBar from './containers/NavBar';
import Feed from './containers/Feed';
import Profile from './containers/Profile';
import RecipeForm from './containers/RecipeForm';
import Recipe from './containers/Recipe';
import BadPath from './containers/BadPath';
import PublicHomePage from './containers/PublicHomePage';

import { Nombook as NB } from './api';
import { updateUser } from './actions/current_user';
import './styles/Nombook.css';
import './styles/main.css';

class Nombook extends Component {
  componentWillMount() {
    let that = this;
    const nb = new NB();
    
    nb.request('GET', '/users/whoami', body => {
      that.props.onUpdateUser(body.current_user)
    })
  }

  render() {
    const nombook = (this.props.current_user) ? (
      <div className="Nombook">

        {/* nav bar */}
        <Route path="/" component={NavBar}/>

        {/* main body */}
        <div className='main'>
          <Switch>
            <Route exact path='/' component={Feed}/>
            <Route 
              exact path='/users/:username' 
              render={(props) => (
                <Profile {...props}/>
              )} />
            <Route 
              exact path='/recipes/new' 
              component={RecipeForm}/>
            <Route 
              exact path='/recipes/:id' 
              render={(props) => (
                <Recipe location={location} {...props}/>
              )} />
            
            {/* catch all */}
            <Route path="*" component={BadPath}/>
          </Switch>
        </div>
      </div>
    ) : (
      <Switch>
        <Route exact path="/" component={PublicHomePage}/>
        <Redirect from='/*' to='/'/>
      </Switch>
    )

    return(
      <Router>
        {nombook}
      </Router>
    )
  }
}

const mapStateToProps = state => {
  return {
    current_user: state.current_user
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateUser: (user) => {
      dispatch(updateUser(user))
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Nombook);