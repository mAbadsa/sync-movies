import React from 'react';
import PropTypes from 'prop-types';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

import useStyles from './styles';

function Emoji({ open, handleOpen, handleEmoji }) {
  // const [chosenEmoji, setChosenEmoji] = useState('');
  const classes = useStyles();

  const addEmoji = (emoji) => {
    handleEmoji(emoji.native);
    // console.log(chosenEmoji);
    handleOpen(false);
  };

  return (
    <div className={classes.emojiContainer}>
      <Picker
        style={{
          width: '250px',
          position: 'absolute',
          height: '300px',
          overflow: 'hidden',
          overflowY: 'hidden !important',
          top: '15%',
          display: `${open ? 'block' : 'none'}`,
        }}
        onSelect={addEmoji}
        theme="dark"
      />
    </div>
  );
}

Emoji.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  handleEmoji: PropTypes.func.isRequired,
  // value: PropTypes.string.isRequired,
};

export default Emoji;
