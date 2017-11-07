import { EditorState, convertFromRaw } from 'draft-js';

const init = {
  query: "",
  results: {
    users: [],
    recipes: []
  },
  focused: false
}

const search = (state = init, action) => {
  let steps = state.steps

  switch(action.type) {
    case 'CLEAR':
      return init

    case 'CHANGE_QUERY':
      return Object.assign({}, state, {
        query: action.query
      })

    case 'UPDATE_RESULTS':
      return Object.assign({}, state, {
        results: {
          users: action.users,
          recipes: action.recipes
        }
      })

    case 'FOCUS_SEARCH':
      return Object.assign({}, state, {
        focused: action.focused
      })
      
    default:
      return state
  }
};

export default search;