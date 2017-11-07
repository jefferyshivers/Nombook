export const changeQuery = (query) => {
  return {
    type: 'CHANGE_QUERY',
    query: query,
  }
}

export const updateResults = (results) => {
  return {
    type: 'UPDATE_RESULTS',
    users: results.users,
    recipes: []
  }
}

export const focusSearch = () => {
  return {
    type: 'FOCUS_SEARCH',
    focused: true
  }
}

export const unFocusSearch = () => {
  return {
    type: 'FOCUS_SEARCH',
    focused: false
  }
}

export const clearSearch = () => {
  return {
    type: 'CLEAR'
  }
}

// export const changeStep = (index_in_recipe, editorState) => {
//   return {
//     type: 'UPDATE_STEP',
//     index: index_in_recipe,
//     body: editorState
//   }
// }