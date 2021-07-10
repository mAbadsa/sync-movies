import React, { useState, useRef } from 'react';
import { useTheme } from 'react-jss';

import useStyles from './styles';

import Emoji from './Emoji';

function InputBar() {
  const inputChat = useRef();
  const theme = useTheme();
  const classes = useStyles({ theme });
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const handleOpenEmojiBox = () => {
    setOpen(!open);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleEmojiWithText = (_emoji) => {
    // setEmoji(_emoji);
    const text = value + _emoji;
    setValue(text);
    inputChat.current.focus();
    console.log(text);
  };
  // setEmoji(value + emoji);

  return (
    <div className={classes.InputBar}>
      <Emoji
        open={open}
        handleOpen={setOpen}
        value={value}
        handleEmoji={handleEmojiWithText}
      />
      <button
        className={classes.EmojiSwitch}
        onClick={handleOpenEmojiBox}
        type="button"
      >
        <i className="fas fa-laugh" />
      </button>
      <div className={classes.MessageInputContainer}>
        <input
          className={classes.messageInput}
          type="text"
          value={value}
          onChange={handleChange}
          ref={inputChat}
        />
        <i className="fas fa-paper-plane" />
      </div>
    </div>
  );
}

export default InputBar;
