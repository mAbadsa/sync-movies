import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'react-jss';
import { useParams, useHistory } from 'react-router-dom';

// import { useSelector, useDispatch } from 'react-redux';
// import { useSelector } from 'react-redux';

// import { getUsersConnectionCount } from '../../redux/actions/shareMoies';

import Video from '../../components/video';
import Button from '../../components/Button';
import RoomController from '../../components/RoomController';
import ChatBox from '../../components/ChatBox';

import useStyles from './styles';

function Dashboard({ socket }) {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { roomId } = useParams();
  const history = useHistory();

  const [nOfUsers, setNoOfUsers] = useState(0);
  const [shareLink, setShareLink] = useState('');
  // const [refresh, setRefresh] = useState(false);
  const shareLinkRef = useRef(null);

  const handleIdCopy = (e) => {
    shareLinkRef.current.select();
    shareLinkRef.current.setSelectionRange(0, 99999);
    document.execCommand('copy');
    e.target.focus();
  };

  const handleChange = () => {
    setShareLink(
      `${window.location.protocol}//${window.location.host}/${roomId}`
    );
  };

  // window.addEventListener('beforeunload', (e) => {
  //   e.preventDefault();
  //   e.returnValue = 'One user leaved!';
  //   // socket.emit('disconnect', { message: e.returnValue });
  //   // socket.emit('leave-room', { roomId, message: e.returnValue });
  //   return e.returnValue;
  // });

  useEffect(() => {
    socket.emit('join-room', {
      roomId,
    });
    socket.emit('number-user-connected', { roomId });
  }, []);

  useEffect(() => {
    handleChange();
    socket.on('number-user-connected', ({ connectedUsers }) => {
      console.log({ connectedUsers });
      // if (localStorage.getItem('shareVideo')) {
      //   const shareVideo = JSON.parse(
      //     window.localStorage.getItem('shareVideo')
      //   );
      //   window.localStorage.setItem(
      //     'shareVideo',
      //     JSON.stringify({ ...shareVideo, connectedUsers })
      //   );
      // }
      setNoOfUsers(connectedUsers);
    });
    socket.on('invalid-room', () => {
      console.log('room is not exists.');
      history.push('/');
    });
    socket.on('roomId', (data) => {
      // history.push(`/${roomId}`);
      console.log({ data });
      setNoOfUsers(data.connectedUsers);
    });
    socket.on('socket-disconnect', ({ connectedUsers }) => {
      // window.localStorage.removeItem('shareVideo');
      console.log({ connectedUsers });
      setNoOfUsers(connectedUsers);
      // history.push('/');
    });
    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }, []);

  const handleRoomLeave = () => {
    console.log('LEAVE..');
    socket.emit('leave-room', { roomId });
    // setRefresh(!refresh);
  };

  return (
    <div className={classes.Dashboard}>
      <div className={classes.statusBar}>
        <p className={classes.userCounter}>
          <span>{nOfUsers}</span> {nOfUsers === 1 ? 'user' : 'users'}
        </p>
      </div>
      <header className={classes.header}>
        <button
          onClick={handleRoomLeave}
          type="button"
          className={classes.leaveButtonMobile}
        >
          <i className="fas fa-phone" />
        </button>
        <div className={classes.linkBox}>
          <input
            ref={shareLinkRef}
            className={classes.linkText}
            value={shareLink}
            onChange={handleChange}
            // disabled
          />
          <button
            className={classes.copyButton}
            type="button"
            onClick={handleIdCopy}
          >
            copy
          </button>
        </div>
        <div className={classes.leaveButton}>
          <Button
            handleClick={handleRoomLeave}
            variant="danger"
            text="Leave"
            size="large"
          />
        </div>
      </header>
      <div className={classes.mainContent}>
        <div className={classes.roomControllerBox}>
          <Video />
          <RoomController />
        </div>
        <div className={classes.chatContainer}>
          <ChatBox />
        </div>
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  socket: PropTypes.objectOf.isRequired,
};

export default Dashboard;
