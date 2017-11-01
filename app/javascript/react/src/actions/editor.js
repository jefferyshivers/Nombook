export const changeMetaField = (field, editorState) => {
  return {
    type: 'UPDATE_NAME_DESCRIPT_OR_INGS',
    field: field,
    body: editorState
  }
}

export const changeStep = (index_in_recipe, editorState) => {
  return {
    type: 'UPDATE_STEP',
    index: index_in_recipe,
    body: editorState
  }
}

export const addAStep = () => {
  return {
    type: 'ADD_STEP'
  }
}

export const clearForm = () => {
  return {
    type: 'CLEAR_FORM'
  }
}