import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

import useStyles from './styles';

function Video({ url }) {
  const classes = useStyles();
  return (
    <div className={classes.Video}>
      <ReactPlayer style={{ width: '100%' }} width="100%" url={url} controls />
    </div>
  );
}

Video.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Video;
