// import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

function LogoutRoute({ children, path }) {
  const { isAuth } = useSelector((state) => state);
  console.log({ isAuth });
  if (isAuth) {
    return <Redirect to="/dashboard" />;
  }
  return <Route path={path}>{children}</Route>;
}

LogoutRoute.propTypes = {
  children: PropTypes.element.isRequired,
  path: PropTypes.string.isRequired,
};

export default LogoutRoute;
