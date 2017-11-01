import React, { Component } from 'react';

// import '../styles/components/LoginForm.css'

class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      password: "",
      csrfToken: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    let csrfToken = document.getElementsByName('csrf-token')[0].content
    this.setState({
      csrfToken: csrfToken
    })
  }

  handleChange(e) {
    let id = e.target.id;
    let value = e.target.value;

    this.setState({
      [id]: value
    })
  }

  handleSubmit() {
    let body = JSON.stringify(this.state);
    
    fetch('http://localhost:3000/users/sign_in', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-Token': this.state.csrfToken,
        'Content-Type': 'application/json'
      },
      body: body
    }).then(res => {
      console.log(res)
    })
  }

  render() {
    return(
      <div className='LoginForm'>
        <form onSubmit={this.handleSubmit}>
          <label>
            Email:
            <input type="text" id="email" value={this.state.email} onChange={this.handleChange}/>
          </label>
          <label>
            Password:
            <input type="password" id="password" value={this.state.password} onChange={this.handleChange}/>
          </label>
          <input type="submit" value="Submit"/>
        </form>
      </div>
    );
  }
}

export default LoginForm;