import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  StatusBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '7%',
    boxShadow: '0 -2px 5px 0 #353535',
    backgroundColor: ({ theme }) => theme.modalBackground,
    padding: '0.1rem',
  },
  callButton: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    '& i': {
      color: '#565656',
      fontSize: '18px',
      cursor: 'pointer',
      transition: 'all 0.25s',
      '&:hover': {
        color: ({ theme }) => theme.buttonPrimaryColor,
        transition: 'all 0.25s',
      },
    },
  },
});

export default useStyles;
