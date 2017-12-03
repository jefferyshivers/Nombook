// a small library of helper methods to minimize fetch calls in react components
const basepath = "/api/v1";

// generic request handler
const req = (method, path, callback = () => {}) => {
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

// GET
const GET = (path, callback) => {
  req('GET', path, callback)    
}

// DELETE
const DELETE = (path, callback) => {
  req('DELETE', path, callback)
}
const DELETE_WITH_BODY = (path, body, callback) => {
  req({method: 'DELETE', body: body}, path, callback)
}

// PATCH
const PATCH = (path, body, callback) => {
  req ({method: 'PATCH', body: body}, path, callback)
}

module.exports = {
  GET, DELETE, DELETE_WITH_BODY, PATCH
};