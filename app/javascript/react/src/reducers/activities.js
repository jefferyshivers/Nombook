const ga = require('react-ga');
ga.initialize('UA-109588356-1');

const init = {
  current_view: null
}

const activities = (state = init, action) => {
  switch(action.type) {
    case 'UPDATE_VIEW':
      ga.pageview( action.view );
      return ({ current_view: action.view })

    case 'UPDATE_MODAL_VIEW':
      ga.modalview( action.view );
      return ({ current_view: action.view })

    case 'SEND_ACTIVITY':
      ga.event( action.activity )
      return state

    default:
      return state
  }
};

export default activities;