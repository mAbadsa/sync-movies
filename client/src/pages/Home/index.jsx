import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { io } from 'socket.io-client';

import { useTheme } from 'react-jss';
import shortId from 'shortid';

// import { createRoom, joinRoom } from '../../redux/actions/shareMoies';

import CreateRoomBox from '../../components/CreateRoomBox';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';

import Video from '../../components/video';

import useStyles from './styles';

// let socket;
// const ENDPOINT = '/';

function Home({ socket }) {
  console.log('HOME');
  const history = useHistory();
  // const dispatch = useDispatch();
  const [openJoinModal, setOpenJoinModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [newRoomId, setNewRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const theme = useTheme();
  const classes = useStyles({ theme });

  const handleOpenJoinModal = () => {
    setOpenJoinModal(true);
  };

  const handleNickname = (e) => {
    setUsername(e.target.value);
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleGenerateRoomId = () => {
    setNewRoomId(shortId.generate());
  };

  const handleExistRoomId = (evt) => {
    setRoomId(evt.target.value);
  };

  const handleCreateRoom = () => {
    // should await
    // socket = io.connect(ENDPOINT);
    socket.emit('create-room', {
      newRoomId,
      username,
    });
    console.log(socket);
    socket.on(
      'create-room',
      ({
        roomId: _newRoomId,
        connectedUsers,
        loadedData,
        id,
        // loadDataUsers,
      }) => {
        console.log(loadedData);
        setUsername('loadedData');
        setSuccessMsg('Success...');
        window.localStorage.setItem(
          'shareVideo',
          JSON.stringify({
            isCreated: true,
            roomId: _newRoomId,
            username,
            userId: id,
            role: 'master',
            isAuth: true,
            connectedUsers,
          })
        );
        console.log({
          newRoomId: _newRoomId,
          id,
          connectedUsers,
          // username: _username,
        });
        // dispatch(
        //   createRoom({ newRoomId: _newRoomId, username, connectedUsers })
        // );
        // setUserCount(connectedUsers);
        history.push(`/${_newRoomId}`);
      }
    );
  };

  const handleJoinRoom = () => {
    // socket = io.connect(ENDPOINT);
    socket.emit('join-room', {
      roomId,
      username,
    });
    socket.on('join-room-data', (data) => {
      setUsername(data.username);
      setSuccessMsg('Success...');
      window.localStorage.setItem(
        'shareVideo',
        JSON.stringify({
          roomId: data.roomId,
          username,
          role: 'user',
          isAuth: true,
          connectedUsers: data.connectedUsers,
        })
      );
      // dispatch(
      //   joinRoom({
      //     roomId: data.roomId,
      //     username,
      //     connectedUsers: data.connectedUsers,
      //   })
      // );
      // setUserCount(data.connectedUsers);
      history.push(`/${roomId}`);
    });
  };

  return (
    <div className={classes.Home}>
      {successMsg.length > 0 && <Alert type="success">{successMsg}</Alert>}
      <Modal open={openJoinModal} closeModel={() => setOpenJoinModal(false)}>
        <CreateRoomBox titleText="Join The Room">
          <Input
            placeholder="Enter your nickname..."
            value={username}
            handleChange={handleNickname}
          />
          <Input
            placeholder="Enter the room ID..."
            value={roomId}
            handleChange={handleExistRoomId}
          />
          <Button
            text="Join"
            variant="primary"
            size="large"
            handleClick={handleJoinRoom}
          />
        </CreateRoomBox>
      </Modal>
      <Modal
        open={openCreateModal}
        closeModel={() => setOpenCreateModal(false)}
      >
        <CreateRoomBox titleText="Create New Room">
          <Input
            placeholder="Enter your nickname..."
            value={username}
            handleChange={handleNickname}
          />
          <Input
            placeholder="Room ID..."
            value={newRoomId}
            handleChange={() => ({})}
            withButton
          />
          <Button
            variant="primary"
            size="large"
            text="Generate ID"
            handleClick={handleGenerateRoomId}
          />
          <Button
            variant="success"
            size="large"
            text="Create Room"
            handleClick={handleCreateRoom}
            disabled={newRoomId.length === 0 || username.length <= 3}
          />
        </CreateRoomBox>
      </Modal>
      <nav className={classes.nav}>
        <div className={classes.buttonBox}>
          <Button handleClick={handleOpenJoinModal} size="large" />
          <Button
            handleClick={handleOpenCreateModal}
            size="large"
            variant="success"
            text="Create New Room"
          />
        </div>
      </nav>
      <div className={classes.title}>
        <h2>Watch a video with your friends</h2>
      </div>
      <main className={classes.mainContent}>
        <Video />
      </main>
    </div>
  );
}

Home.propTypes = {
  socket: PropTypes.objectOf.isRequired,
};

export default Home;
