// authReducer.js
import { LOGIN_USER, LOGOUT_USER } from './actions';

const initialState = {
  token: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        token: action.payload.token,
      };
    case LOGOUT_USER:
      return {
        ...state,
        token: null,
      };
    default:
      return state;
  }
};

export default authReducer;

