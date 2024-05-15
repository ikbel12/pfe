// actions.js
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

export const loginUser = (token) => ({
  type: LOGIN_USER,
  payload: { token },
});

export const logoutUser = () => ({
  type: LOGOUT_USER,
});
