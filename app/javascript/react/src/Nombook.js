import React, { Component } from 'react';
import { 
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import NavBar from './containers/NavBar'
import Feed from './containers/Feed'
import Users from './containers/Users'
import Recipes from './containers/Recipes'
import BadPath from './containers/BadPath'
import PublicHomePage from './containers/PublicHomePage'

import './styles/Nombook.css'
import './styles/main.css'

export default class Nombook extends Component {
  componentWillMount() {
    // get user authentication
    // load into store
    console.log('i will mount')
  }

  render() {
    const nombook = (this.props.is_logged_in === true) ? (
      <div className="Nombook">
        {/* nav bar */}
        <Route path="/" component={NavBar}/>

        {/* main body */}
        <div className='main'>
          <Switch>
            <Route exact path='/' component={Feed}/>
            <Route 
              exact path='/users/:id' 
              render={(props) => (
                <Users {...props}/>
              )} />
            <Route 
              exact path='/recipes/new' 
              component={Recipes}/>
            <Route 
              exact path='/recipes/:id' 
              render={(props) => (
                <Recipes {...props}/>
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