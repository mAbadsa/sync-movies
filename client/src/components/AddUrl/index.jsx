import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'react-jss';

import Input from '../Input';
import Button from '../Button';

import useStyles from './styles';

function AddUrl({ sendUrlMovie, value, handleChange }) {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const handleSendUrlMovie = () => {
    console.log('handleSendUrlMovie');
    sendUrlMovie(value);
  };

  return (
    <div className={classes.AddUrl}>
      <Input
        placeholder="Enter the movie url..."
        value={value}
        handleChange={handleChange}
      />
      <div className={classes.AddUrlBtnContainer}>
        <Button
          handleClick={handleSendUrlMovie}
          size="large"
          variant="success"
          text="Add url"
          // disabled={value.length === '0'}
        />
      </div>
    </div>
  );
}

AddUrl.propTypes = {
  sendUrlMovie: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default AddUrl;
