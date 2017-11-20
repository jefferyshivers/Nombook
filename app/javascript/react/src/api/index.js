
const fetchHelpers = require('./fetchHelpers');

const basepath = "/api/v1";

class Nombook {
  constructor(props) {
    this.request = this.request.bind(this)
    this.getCurrentUser = this.getCurrentUser.bind(this)
  }

  getCurrentUser(callback) {
    fetchHelpers.GET('/users/whoami', callback)
  }

  // TODO factor this out completely:
  request (method, path, callback = () => {}) {
    params = {
      headers: {'Content-Type': 'application/json'},
      credentials: 'same-origin'
    }
    if (method !== 'GET' && method !== 'DELETE') {
      params.method = method.method
      params.body = method.body
    } else {
      params.method = method
    }
  
    fetch(`${basepath}${path}`, params)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Response not ok.')
      })
      .then(body => {
        callback(body)
      })
      .catch(error => {
        console.info('Error in request:', error.message)
        callback(false)
      });
  }
}

module.exports = { Nombook };