import React from 'react';
import { useTheme } from 'react-jss';

import InputBar from './InputBar';
import MessagesBox from './MessagesBox';
import StatusBar from './StatusBar';

import useStyles from './styles';

function ChatBox() {
  const theme = useTheme();
  const classes = useStyles({ theme });
  return (
    <div className={classes.ChatBox}>
      <StatusBar />
      <MessagesBox />
      <InputBar />
    </div>
  );
}

export default ChatBox;
