import { EditorState, convertFromRaw } from 'draft-js';

const new_step_blueprint = { 
  index_in_recipe: 0,
  body: EditorState.createEmpty()
}

const init = {
  name: EditorState.createEmpty(),
  description: EditorState.createEmpty(),
  ingredients_body: EditorState.createEmpty(),
  steps: [new_step_blueprint],
  forked_from_recipe: false
}

const editor = (state = init, action) => {
  switch(action.type) {
    case 'ADD_STEP':
      let new_step = Object.assign({}, new_step_blueprint, {
        index_in_recipe: state.steps.length,
        body: EditorState.createEmpty()
      })

      return Object.assign({}, state, {
        steps: state.steps.concat(new_step)
      })

    case 'DELETE_STEP':
      return Object.assign({}, state, {
        steps: state.steps.filter(step => { return step.index_in_recipe !== action.index })
      })

    case 'UPDATE_STEP':
      let steps = state.steps
      if (steps[action.index].index_in_recipe === action.index) {
        steps[action.index].body = action.body
      } else {
        // this shouldn't happen, but leave here for the time being.
        console.log('Index to change does not match index in the list!')
      }
      return Object.assign({}, state, {
        steps: steps
      })
    
    case 'UPDATE_NAME_DESCRIPT_OR_INGS':
      return Object.assign({}, state, {
        [action.field]: action.body
      })

    case 'CLEAR_FORM':
      return init

    default:
      return state
  }
};

export default editor;