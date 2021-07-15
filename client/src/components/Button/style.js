import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  Button: {
    // width: '100%',
    // padding: '10px',
    fontSize: '14px',
    fontWeight: 'lighter',
    '& button': {
      // width: '100%',
      marginBottom: '10px',
      height: '35px',
      padding: '5px',
      color: 'white',
      fontSize: 'inherit',
      borderRadius: '3px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
  },
  primary: {
    border: 'none',
    backgroundColor: ({ theme }) => theme.buttonPrimaryColor,
    '&:hover': {
      backgroundColor: '#25a6dd',
      transition: 'all 0.2s',
    },
  },
  outline: {
    backgroundColor: 'transparent',
    border: '2px solid #8f8f8f',
    color: '#8f8f8f',
    marginLeft: '0.7rem',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#0C99D6',
      border: '2px solid #0C99D6',
      color: '#fff',
      transition: 'all 0.2s',
    },
  },
  danger: {
    border: 'none',
    backgroundColor: ({ theme }) => theme.dangerColor,
    '&:hover': {
      backgroundColor: '#25a6dd',
      transition: 'all 0.2s',
    },
  },
  success: {
    border: 'none',
    backgroundColor: ({ theme }) => theme.successColor,
    '&:hover': {
      backgroundColor: '#31F846',
      transition: 'all 0.2s',
    },
  },
  disabled: {
    cursor: 'not-allowed !important',
    backgroundColor: '#a5a5a5 !important',
  },
  // '@media (max-width: 535px)': {
  //   Button: {

  //   },
  // },
  '@media (max-width: 425px)': {
    Button: {
      // width: '100px',
      // marginLeft: '10px',
      '& button': {
        marginLeft: '0px',
      },
    },
    outline: {
      width: '100px',
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
      // width: '100%',
    },
  },
});

export default useStyles;
