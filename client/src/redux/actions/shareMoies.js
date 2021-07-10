import * as types from '../types';

export const createRoom = ({ newRoomId, username, connectedUsers }) => {
  return {
    type: types.CREATE_ROOM,
    roomId: newRoomId,
    username,
    connectedUsers,
  };
};

export const joinRoom = ({ roomId, username, connectedUsers }) => {
  return {
    type: types.JOIN_ROOM,
    roomId,
    username,
    connectedUsers,
  };
};

export const getAuthStatus = ({ isAuth }) => {
  console.log('action::', { isAuth });
  return {
    type: types.GET_AUTH_STATUS,
    isAuth,
  };
};

export const getUsersConnectionCount = ({ connectedUsers }) => {
  return {
    type: types.GET_USERS_CONNECTION_COUNT,
    connectedUsers,
  };
};

export const updateState = ({
  isAuth,
  roomId,
  username,
  userId,
  role,
  connectedUsers,
}) => {
  return {
    type: types.UPDATE_STATE,
    isAuth,
    roomId,
    username,
    userId,
    role,
    connectedUsers,
  };
};
