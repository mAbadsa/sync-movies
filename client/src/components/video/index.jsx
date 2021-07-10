import React from 'react';
import ReactPlayer from 'react-player';

import useStyles from './styles';

function Video() {
  const classes = useStyles();
  return (
    <div className={classes.Video}>
      <ReactPlayer
        style={{ width: '100%' }}
        width="100%"
        url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
        controls
      />
    </div>
  );
}

export default Video;
