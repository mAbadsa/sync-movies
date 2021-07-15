import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  Home: {
    position: 'relative',
    backgroundColor: '#2E2E2E',
    minHeight: '100vh',
    maxWidth: '1140px',
    margin: '0 auto',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '1rem',
    height: '100vh',
  },
  buttonBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-satrt',
    alignItems: 'center',
    padding: '1rem',
    // width: '45%',
    transition: 'all 0.25s',
  },
  joinRoom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '1rem',
  },
  joinRoomInputContainer: {
    width: '200px',
  },
  title: {
    padding: '2rem',
    margin: '0 auto',
    width: '100%',
    '& h2': {
      color: ({ theme }) => theme.secondaryColor,
      fontWeight: 'lighter',
    },
  },

  editUsernameContainer: {
    position: 'relative',
  },
  showUsername: {
    color: ({ theme }) => theme.secondaryColor,
    textAlign: 'left',
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    top: '0',
    right: '0',
    '& i': {
      color: ({ theme }) => theme.secondaryColor,
      fontSize: '20px',
      cursor: 'pointer',
      transition: 'all 0.25s',
      '&:hover': {
        color: ({ theme }) => theme.buttonPrimaryColor,
        transition: 'all 0.25s',
      },
    },
  },
  // mainContent: {
  //   display: 'flex',
  //   justifyContent: 'center',
  // },
  '@media (max-width: 535px)': {
    buttonBox: {
      // width: '100%',
      // flexWrap: 'wrap',
      alignItems: 'self-start',
      flexDirection: 'column',
      transition: 'all 0.25s',
    },
    joinRoom: {
      padding: '0',
    },
    joinRoomInputContainer: {
      width: '100%',
    },
    Button: {
      width: 'auto',
    },
  },
  '@media (max-width: 768px)': {
    buttonBox: {
      width: '100%',
      // flexDirection: 'column',
    },
  },
});

export default useStyles;
