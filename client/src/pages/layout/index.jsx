import React from 'react';
import PropTypes from 'prop-types';

import { useTheme } from 'react-jss';

import useStyles from './style';

function Layout({ children }) {
  const theme = useTheme();
  const classes = useStyles({ theme });

  return <div className={classes.Layout}>{children}</div>;
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Layout;
