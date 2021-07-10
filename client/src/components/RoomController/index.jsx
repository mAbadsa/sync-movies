import React from 'react';
import { useTheme } from 'react-jss';

import useStyles from './styles';

function RoomController() {
  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <div classes={classes.RoomController}>
      <div />
    </div>
  );
}

export default RoomController;
