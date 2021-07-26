import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { io } from 'socket.io-client';

import { useTheme } from 'react-jss';

// import { createRoom, joinRoom } from '../../redux/actions/shareMoies';

import CreateRoomBox from '../../components/CreateRoomBox';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Alert from '../../components/Alert';

// import Video from '../../components/video';

import useStyles from './styles';

// let socket;
// const ENDPOINT = '/';

function Home({ socket, handleIsJoined }) {
  const history = useHistory();
  const location = useLocation();
  // const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [openJoinModal, setOpenJoinModal] = useState(false);
  const [openUseNameModal, setOpenUseNameModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const theme = useTheme();
  const classes = useStyles({ theme });

  let oldNickName;
  if (JSON.parse(window.localStorage.getItem('share-movies'))) {
    const localStorageObj = JSON.parse(
      window.localStorage.getItem('share-movies')
    );
    const hasNickname = Object.prototype.hasOwnProperty.call(
      localStorageObj,
      'nickname'
    );
    if (hasNickname) {
      oldNickName = JSON.parse(
        window.localStorage.getItem('share-movies')
      )?.nickname;
    }
  }

  useEffect(() => {
    if (JSON.parse(window.localStorage.getItem('share-movies'))) {
      const { nickname } = JSON.parse(
        window.localStorage.getItem('share-movies')
      );
      setUsername(nickname || '');
    }
  }, []);

  useEffect(() => {
    if (location.state?.message.length > 0) {
      setOpenUseNameModal(true);
    }
    if (oldNickName) {
      socket.on('roomId', ({ roomId: _roomId }) => {
        // setUsername(_username);
        setSuccessMsg('Success...');
        const oldData =
          JSON.parse(window.localStorage.getItem('share-movies')) || {};
        window.localStorage.setItem(
          'share-movies',
          JSON.stringify({
            ...oldData,
            role: 'user',
          })
        );
        history.push(`/${_roomId}`);
      });
      socket.on('is-joined', ({ nickname }) => {
        // setUsername(_username);
        setSuccessMsg('Success...');
        window.localStorage.setItem(
          'share-movies',
          JSON.stringify({
            nickname,
          })
        );
      });
      socket.on(
        'create-room',
        ({
          roomId: _newRoomId,
          id,
          nickname,
          // loadDataUsers,
        }) => {
          setSuccessMsg('Success...');
          console.log('create-app');
          window.localStorage.setItem(
            'share-movies',
            JSON.stringify({
              nickname,
              userId: id,
              role: 'master',
            })
          );
          history.push(`/${_newRoomId}`);
        }
      );
    }
  }, []);

  const handleSaveName = () => {
    const oldData =
      JSON.parse(window.localStorage.getItem('share-movies')) || {};
    window.localStorage.setItem(
      'share-movies',
      JSON.stringify({
        ...oldData,
        nickname: username,
      })
    );
    setIsEdit(false);
  };

  const handleOpenJoinModal = () => {
    setOpenJoinModal(true);
  };

  const handleNickname = (e) => {
    setUsername(e.target.value);
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleExistRoomId = (evt) => {
    setRoomId(evt.target.value);
  };

  const handleCreateRoom = () => {
    handleSaveName();
    socket.emit('create-room', {
      nickname: username,
    });
    handleIsJoined(true);
  };

  const handleEditState = () => {
    setIsEdit(true);
  };

  const handleJoinRoom = () => {
    socket.emit('join-room', {
      roomId,
      nickname: username,
      id: socket.id,
    });
    handleIsJoined(true);
  };

  const handleAddUsername = () => {
    setUsername(username);
    if (username.length > 3) {
      setOpenUseNameModal(false);
    }
    handleSaveName();
    history.push(`/${location.state.roomId}`);
  };

  return (
    <div className={classes.Home}>
      {successMsg.length > 0 && <Alert type="success">{successMsg}</Alert>}
      {location.state?.message.length > 0 && (
        <Alert type="error">{location.state?.message}</Alert>
      )}
      <Modal
        open={openUseNameModal}
        closeModel={() => setOpenUseNameModal(false)}
      >
        <CreateRoomBox titleText="Join The Room">
          <Input
            placeholder="Enter your nickname..."
            value={username}
            handleChange={handleNickname}
            handleSaveName={handleSaveName}
          />
        </CreateRoomBox>
        <Button
          text="Add Nickname"
          variant="primary"
          size="large"
          handleClick={handleAddUsername}
          disabled={username.length < 4}
        />
      </Modal>
      <Modal open={openJoinModal} closeModel={() => setOpenJoinModal(false)}>
        <CreateRoomBox titleText="Join The Room">
          {!oldNickName ? (
            <Input
              placeholder="Enter your nickname..."
              value={username}
              handleChange={handleNickname}
              handleSaveName={handleSaveName}
            />
          ) : (
            <>
              {isEdit ? (
                <Input
                  placeholder="Enter your nickname..."
                  value={username}
                  handleChange={handleNickname}
                  handleSaveName={handleSaveName}
                  htmlElement="edit"
                />
              ) : (
                <div className={classes.editUsernameContainer}>
                  <p className={classes.showUsername}>{username}</p>
                  <button
                    className={classes.editButton}
                    type="button"
                    onClick={handleEditState}
                  >
                    <i className="fas fa-edit" />
                  </button>
                </div>
              )}
            </>
          )}
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
          {!oldNickName ? (
            <Input
              placeholder="Enter your nickname..."
              value={username}
              handleChange={handleNickname}
              handleSaveName={handleSaveName}
            />
          ) : (
            <>
              {isEdit ? (
                <Input
                  placeholder="Enter your nickname..."
                  value={username}
                  handleChange={handleNickname}
                  handleSaveName={handleSaveName}
                  htmlElement="edit"
                />
              ) : (
                <div className={classes.editUsernameContainer}>
                  <p className={classes.showUsername}>{username}</p>
                  <button
                    className={classes.editButton}
                    type="button"
                    onClick={handleEditState}
                  >
                    <i className="fas fa-edit" />
                  </button>
                </div>
              )}
            </>
          )}
          <Button
            variant="success"
            size="large"
            text="Create Room"
            handleClick={handleCreateRoom}
            disabled={username.length <= 3}
          />
        </CreateRoomBox>
      </Modal>
      <main className={classes.mainContent}>
        <div className={classes.title}>
          <h2>Watch a video with your friends</h2>
        </div>
        <div className={classes.buttonBox}>
          <Button
            handleClick={handleOpenCreateModal}
            size="large"
            variant="success"
            text="Create New Room"
          />
          <div className={classes.joinRoom}>
            <div className={classes.joinRoomInputContainer}>
              <Input
                placeholder="Enter the room ID..."
                value={roomId}
                handleChange={handleExistRoomId}
              />
            </div>
            <Button
              handleClick={handleOpenJoinModal}
              size="large"
              variant="outline"
              disabled={roomId.length === 0}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

Home.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  socket: PropTypes.object.isRequired,
  handleIsJoined: PropTypes.func.isRequired,
};

export default Home;
