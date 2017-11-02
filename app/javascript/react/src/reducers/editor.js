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
  forked_from_recipe_id: false,
  forked_from_recipe_name: false
}

const editor = (state = init, action) => {
  let steps = state.steps

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
      if (steps[action.index].index_in_recipe === action.index) {
        steps.splice(action.index, 1)
        steps = steps.map((step, index) => {
          return {
            index_in_recipe: index,
            body: step.body
          }
        })
      } else {
        console.log('Index to change does not match index in the list!')
      }
      return Object.assign({}, state, {
        steps: steps
      })

    case 'UPDATE_STEP':
      if (steps[action.index].index_in_recipe === action.index) {
        steps[action.index].body = action.body
      } else {
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

    case 'FORK':
      return Object.assign({}, init, {
        forked_from_recipe_name: action.name,
        forked_from_recipe_id: action.id,
        name: action.name,
        ingredients_body: action.ingredients_body,
        steps: action.steps
      })

    default:
      return state
  }
};

export default editor;