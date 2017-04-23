export const SET_USER = 'SET_USER';
export function setUser(userId, token) {
  return {
    type: SET_USER,
    userId,
    token,
  };
}

export const CLEAR_USER = 'CLEAR_USER';
export function clearUser() {
  return {
    type: CLEAR_USER,
  };
}
