import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'react-jss';

import useStyles from './style';

function Input({ placeholder, value, handleChange, withButton }) {
  const theme = useTheme();
  const classes = useStyles({ theme });
  const inputRef = useRef(null);

  const handleIdCopy = (e) => {
    inputRef.current.select();
    inputRef.current.setSelectionRange(0, 99999);
    document.execCommand('copy');
    e.target.focus();
  };

  return (
    <div className={classes.Input}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        ref={inputRef}
      />
      {withButton && (
        <button
          className={classes.copyButton}
          type="button"
          onClick={handleIdCopy}
        >
          copy
        </button>
      )}
    </div>
  );
}

Input.defaultProps = {
  placeholder: 'Enter you nickname.',
  value: '',
  withButton: false,
};

Input.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  withButton: PropTypes.bool,
};

export default Input;
