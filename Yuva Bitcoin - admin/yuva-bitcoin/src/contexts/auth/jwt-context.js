import { createContext, useCallback, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { authApi } from '../../api/auth';
import { Issuer } from '../../utils/auth';

import axios from 'axios';
import { useSnackbar } from 'notistack';

const BASEURL = process.env.NEXT_PUBLIC_BASE_URL;
const STORAGE_KEY = 'accessToken';

var ActionType;
(function (ActionType) {
  ActionType['INITIALIZE'] = 'INITIALIZE';
  ActionType['SIGN_IN'] = 'SIGN_IN';
  ActionType['SIGN_UP'] = 'SIGN_UP';
  ActionType['SIGN_OUT'] = 'SIGN_OUT';
})(ActionType || (ActionType = {}));

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  SIGN_IN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  SIGN_UP: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  SIGN_OUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  })
};

const reducer = (state, action) => (handlers[action.type]
  ? handlers[action.type](state, action)
  : state);

export const AuthContext = createContext({
  ...initialState,
  issuer: Issuer.JWT,
  signIn: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
  signOut: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = globalThis.localStorage.getItem('accessToken');

      console.log(accessToken);

      if (accessToken) {

        const user = await axios.get(`${BASEURL}/api/Dashboard/admin`, {
          headers: {
            Authorization: accessToken
          }
        })

        console.log(user.data);

        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: true,
            user
          }
        });
      } else {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    } catch (err) {
      console.error(err?.response?.data);
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
    }
  }, [dispatch]);

  useEffect(() => {
    initialize();
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

    const signIn = useCallback(async (email, password) => {
        const response = await axios.post(`${BASEURL}/api/Auth/admin-login`, {
          email,
          password
        });
        
          console.log(response.data);
          const { token, user } = response.data;
          localStorage.setItem(STORAGE_KEY, token);

          console.log(token);
  
          dispatch({
            type: ActionType.SIGN_IN,
            payload: {
              user
            }
          });
      }, [dispatch]);
    
  const signUp = useCallback(async (email, name, password) => {
    const { accessToken } = await authApi.signUp({ email, name, password });
    const user = await authApi.me({ accessToken });

    localStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: ActionType.SIGN_UP,
      payload: {
        user
      }
    });
  }, [dispatch]);

  const signOut = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: ActionType.SIGN_OUT });
    enqueueSnackbar("Logged out successfully", { variant: "success" });
  }, [dispatch]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        issuer: Issuer.JWT,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const AuthConsumer = AuthContext.Consumer;
