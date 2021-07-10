import React from 'react';
import { useTheme } from 'react-jss';

import useStyles from './styles';

function StatusBar() {
  const theme = useTheme();
  const classes = useStyles({ theme });
  return (
    <div className={classes.StatusBar}>
      <div>
        <button className={classes.callButton} type="button">
          <i className="fas fa-phone" />
        </button>
      </div>
    </div>
  );
}

export default StatusBar;
