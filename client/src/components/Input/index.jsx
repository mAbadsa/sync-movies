import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'react-jss';

import useStyles from './style';

function Input({
  placeholder,
  value,
  handleChange,
  htmlElement,
  handleSaveName,
}) {
  const theme = useTheme();
  const classes = useStyles({ theme });
  const inputRef = useRef(null);

  const handleIdCopy = (e) => {
    inputRef.current.select();
    inputRef.current.setSelectionRange(0, 99999);
    document.execCommand('copy');
    e.target.focus();
  };

  let buttonElement;

  if (htmlElement === 'edit') {
    buttonElement = (
      <button
        className={classes.editButton}
        type="button"
        onClick={handleSaveName}
      >
        <i className="fas fa-check" />
      </button>
    );
  } else if (htmlElement === 'copy') {
    buttonElement = (
      <button
        className={classes.copyButton}
        type="button"
        onClick={handleIdCopy}
      >
        copy
      </button>
    );
  } else {
    buttonElement = '';
  }

  return (
    <div className={classes.Input}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        ref={inputRef}
      />
      {buttonElement}
    </div>
  );
}

Input.defaultProps = {
  placeholder: 'Enter you nickname.',
  value: '',
  htmlElement: '',
  handleSaveName: () => {},
};

Input.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  htmlElement: PropTypes.string,
  handleSaveName: PropTypes.func,
};

export default Input;
