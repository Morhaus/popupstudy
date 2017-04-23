import { SET_USER, CLEAR_USER } from './actions';

const initialState = {
  userId: null,
  token: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        userId: action.userId,
        token: action.token,
      };
    case CLEAR_USER:
      return {
        ...state,
        userId: null,
        token: null,
      };
    default:
      return state;
  }
}
