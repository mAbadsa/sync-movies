import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'react-jss';

import useStyles from './style';

function CreateRoomBox({ titleText, children }) {
  const theme = useTheme();
  const classes = useStyles({ theme });
  return (
    <>
      <div className={classes.CreateRoomBox}>
        <h3>{titleText}</h3>
        {children}
      </div>
    </>
  );
}

CreateRoomBox.defaultProp = {
  open: false,
};

CreateRoomBox.propTypes = {
  titleText: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CreateRoomBox;
