import PropTypes from 'prop-types';
import { useTheme } from 'react-jss';

import useStyles from './style';

function Button({ text, handleClick, variant, size, disabled }) {
  const theme = useTheme();
  const classes = useStyles({ theme });
  let widthSize;
  let variantClass;
  if (size === 'smale') {
    widthSize = '60%';
  } else if (size === 'medium') {
    widthSize = '80%';
  } else if (size === 'large') {
    widthSize = '100%';
  }

  if (variant === 'primary') {
    variantClass = classes.primary;
  } else if (variant === 'success') {
    variantClass = classes.success;
  } else if (variant === 'danger') {
    variantClass = classes.danger;
  }

  return (
    <div className={classes.Button}>
      <button
        className={`${variantClass} ${disabled ? classes.disabled : ''}`}
        style={{ width: widthSize }}
        type="button"
        onClick={handleClick}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  );
}

Button.defaultProps = {
  text: 'Join in',
  variant: 'primary',
  size: 'medium',
  disabled: false,
};

Button.propTypes = {
  variant: PropTypes.string,
  text: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
  size: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
