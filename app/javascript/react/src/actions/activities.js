export const sendView = (view) => {
  return {
    type: 'UPDATE_VIEW',
    view: view
  }
}

export const sendModalView = (view) => {
  return {
    type: 'UPDATE_MODAL_VIEW',
    view: view
  }
}

export const sendActivity = (activity) => {
  return {
    type: 'SEND_ACTIVITY',
    activity: activity
  }
}