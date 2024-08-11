// src/reducers/userReducer.js
import { LOGIN_SUCCESS, LOGOUT } from '../actions/userActions';

const initialState = {
  token: null,
  user: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: {
          name: action.payload.name,
          email: action.payload.email,
          role:action.payload.role,
          _id: action.payload._id
        },
      };
    case LOGOUT:
      return {
        ...state,
        token: null,
        user: null,
      };
    default:
      return state;
  }
};
