
const fetchHelpers = require('./fetchHelpers');

const basepath = "/api/v1";

class Nombook {
  getCurrentUser = (callback) => {
    fetchHelpers.GET('/users/whoami', callback)
  }

  followUser = (current_user_id, followed_id, callback) => {
    let body = JSON.stringify({
      followed_id: followed_id,
    })

    fetchHelpers.PATCH(`/follows/${current_user_id}`, body, callback)
  }

  unfollowUser = (current_user_id, followed_id, callback) => {
    let body = JSON.stringify({
      followed_id: followed_id,
    })

    fetchHelpers.DELETE_WITH_BODY(`/follows/${current_user_id}`, body, callback)
  }

  // TODO
  // - create, update, delete recipe
  // - like, unlike recipe
  // ...


  // TODO factor this out completely:
  request = (method, path, callback = () => {}) => {
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