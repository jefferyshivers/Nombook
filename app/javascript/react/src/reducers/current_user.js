const init = {
  current_user: false
}

const current_user = (state = init, action) => {
  switch(action.type) {
    case 'UPDATE_USER':
      return action.current_user

    default:
      return state
  }
};

export default current_user;