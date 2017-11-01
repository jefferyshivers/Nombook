export const updateUser = (user) => {
  return {
    type: 'UPDATE_USER',
    current_user: user
  }
}