import PropTypes from 'prop-types';
import { useTheme } from 'react-jss';

import Backdrop from '../Backdrop';

import useStyles from './style';

function Modal({ open, closeModel, children }) {
  const theme = useTheme();
  const classes = useStyles({ theme });
  const handleClose = () => closeModel(false);
  return (
    <>
      {open && <Backdrop onClick={handleClose} />}
      <div
        className={classes.Modal}
        style={{ display: open ? 'block' : 'none' }}
      >
        <div className={classes.ModelCloseIconBox}>
          <i
            className="fas fa-times"
            onClick={handleClose}
            role="button"
            tabIndex="0"
            onKeyPress={handleClose}
            label="close"
          />
        </div>
        <div className={classes.MainContent}>{children}</div>
      </div>
    </>
  );
}

Modal.defaultProp = {
  open: false,
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  closeModel: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};

export default Modal;
