import React, { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';
// import io from 'socket.io-client';

export const AuthContext = createContext();

// let socket;

const AuthProvider = ({ children }) => {
  console.log('AUTH');
  const [isJoined, setIsJoined] = useState(false);
  const [isMaster, setIsMaster] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [userRole, setUserRole] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [roomId, setroomId] = useState('');
  useEffect(() => {
    if (localStorage.getItem('shareVideo')) {
      const {
        isCreated,
        role,
        roomId: _roomId,
      } = JSON.parse(window.localStorage.getItem('shareVideo'));
      setroomId(_roomId);
      setIsJoined(isCreated);
      setUserRole(role);
      if (role === 'master') {
        setIsMaster(true);
      }
    }
  }, [refresh]);

  return (
    <AuthContext.Provider
      value={{
        isJoined,
        userRole,
        isMaster,
        setRefresh,
        refresh,
        setUserCount,
        userCount,
        roomId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
