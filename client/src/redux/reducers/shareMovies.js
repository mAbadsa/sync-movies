import * as types from '../types';

const initialState = {
  isAuth: false,
  username: '',
  roomId: '',
  role: 'user',
  connectedUsers: 0,
};

const shareMovies = (state = initialState, action) => {
  switch (action.type) {
    case types.CREATE_ROOM:
      return {
        ...state,
        roomId: action.roomId,
        username: action.username,
        isAuth: true,
        role: 'master',
        connectedUsers: action.connectedUsers,
      };
    case types.JOIN_ROOM:
      return {
        ...state,
        roomId: action.roomId,
        username: action.username,
        isAuth: true,
        role: 'user',
        connectedUsers: action.connectedUsers,
      };
    case types.GET_AUTH_STATUS:
      return {
        ...state,
        isAuth: action.isAuth,
      };
    case types.GET_USERS_CONNECTION_COUNT:
      return {
        ...state,
        connectedUsers: action.connectedUsers,
      };
    case types.UPDATE_STATE:
      return {
        ...state,
        connectedUsers: action.connectedUsers,
        role: action.role,
        roomId: action.roomId,
        username: action.username,
        isAuth: action.isAuth,
        userId: action.userId,
      };

    default:
      return state;
  }
};

export default shareMovies;
