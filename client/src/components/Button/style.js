import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  Button: {
    width: '100%',
    // padding: '10px',
    fontSize: '14px',
    fontWeight: 'lighter',
    '& button': {
      width: '100%',
      height: '35px',
      padding: '5px',
      color: 'white',
      border: 'none',
      fontSize: 'inherit',
      borderRadius: '3px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
  },
  primary: {
    backgroundColor: ({ theme }) => theme.buttonPrimaryColor,
    '&hover': {
      backgroundColor: '#25a6dd',
      transition: 'all 0.2s',
    },
  },
  danger: {
    backgroundColor: ({ theme }) => theme.dangerColor,
    '&hover': {
      backgroundColor: '#25a6dd',
      transition: 'all 0.2s',
    },
  },
  success: {
    backgroundColor: ({ theme }) => theme.successColor,
    '&hover': {
      backgroundColor: '#31F846',
      transition: 'all 0.2s',
    },
  },
  disabled: {
    cursor: 'not-allowed !important',
    backgroundColor: '#a5a5a5 !important',
  },
  '@media (max-width: 425px)': {
    Button: {
      width: '100%',
    },
    primary: {
      width: '100%',
    },
    dnager: {
      width: '100%',
    },
  },
  '@media (max-width: 768px)': {
    Button: {
      width: '100%',
    },
  },
});

export default useStyles;
