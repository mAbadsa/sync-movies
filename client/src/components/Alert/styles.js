import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  Alert: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    top: '2%',
    right: '3%',
    width: '350px',
    height: '50px',
    borderRadius: '5px',
    padding: '0.75rem',
    color: '#FFFFFF',
    '& i': {
      position: 'absolute',
      top: '8px',
      right: '8px',
      cursor: 'pointer',
    },
  },
  error: {
    backgroundColor: '#e41749',
  },
  success: {
    backgroundColor: '#12c99b',
  },
});

export default useStyles;
