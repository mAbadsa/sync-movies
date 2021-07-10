import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  InputBar: {
    display: 'flex',
    justifyContent: 'space-between',
    height: '10%',
    boxShadow: '0 -2px 5px 0 #353535',
    padding: '0.4rem',
  },
  MessageInputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '80%',
    paddingRight: '5px',
    '& i': {
      color: '#565656',
      fontSize: '22px',
      transition: 'all 0.25s',
      '&:hover': {
        color: ({ theme }) => theme.buttonPrimaryColor,
        cursor: 'pointer',
        transition: 'all 0.25s',
      },
    },
  },
  messageInput: {
    width: '85%',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#565656',
    outline: 'none',
    padding: '5px 10px',
    color: '#252525',
    fontSize: '16px',
  },
  EmojiSwitch: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0.5rem',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    '& i': {
      color: '#565656',
      fontSize: '22px',
      transition: 'all 0.25s',
      '&:hover': {
        color: '#b5a525',
        cursor: 'pointer',
        transition: 'all 0.25s',
      },
    },
  },
});

export default useStyles;
