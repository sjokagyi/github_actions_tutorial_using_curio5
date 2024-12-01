import { REGISTER, LOGIN, LOGOUT, INITIALIZE } from './actions';

// initial state
export const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
  authTokens: null
};

// ==============================|| AUTH REDUCER ||============================== //

const auth = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE: {
      const { isLoggedIn, user, authTokens } = action.payload;
      return {
        ...state,
        isLoggedIn,
        isInitialized: true,
        user,
        authTokens
      };
    }
    case REGISTER: {
      const { user } = action.payload;
      return {
        ...state,
        user
      };
    }
    case LOGIN: {
      const { user, authTokens } = action.payload;
      return {
        ...state,
        isLoggedIn: true,
        isInitialized: true,
        user,
        authTokens
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isInitialized: true,
        isLoggedIn: false,
        user: null,
        authTokens: null
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default auth;
