import React, { useState } from 'react';
import PropTypes from 'prop-types';

import useStyles from './styles';

function Alert({ type, children }) {
  const [open, setOpen] = useState(true);
  const classes = useStyles();
  const handleClose = () => {
    setOpen(false);
  };

  // setTimeout(() => setOpen(false), 3000);

  return (
    <div
      className={`${classes.Alert} ${
        type === 'success' ? classes.success : classes.error
      }`}
      style={{ display: `${open ? 'flex' : 'none'}` }}
    >
      <i
        className="fas fa-times"
        onClick={handleClose}
        role="button"
        tabIndex="0"
        onKeyPress={handleClose}
        label="close"
      />
      <p>{children}</p>
    </div>
  );
}

Alert.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Alert;
