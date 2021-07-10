import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  Dashboard: {
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0.25rem',
    '& p': {
      margin: '0.1rem',
      color: ({ theme }) => theme.secondaryColor,
      fontSize: '12px',
      fontWeight: 'lighter',
      '& span': {
        color: ({ theme }) => theme.successColor,
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
  },
  header: {
    padding: '0.7rem',
    position: 'relative',
    marginBottom: '1rem',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#55555515',
  },
  mainContent: {
    width: '100%',
    minHeight: '400px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  roomControllerBox: {
    width: '70%',
  },
  chatContainer: {
    width: '28%',
    minHeight: '100%',
    overflow: 'hidden',
  },
  linkBox: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    padding: '0.75rem',
    width: 'min(45%, 280px)',
    borderRadius: '5px',
    background: ({ theme }) => theme.modalBackground,
    '& input': {
      width: '100%',
      backgroundColor: 'transparent',
      border: 'none',
      outline: 'none',
    },
  },
  linkText: {
    display: 'flex',
    alignItems: 'center',
    color: ({ theme }) => theme.secondaryColor,
  },
  copyButton: {
    position: 'absolute',
    right: '4.5%',
    top: '31%',
    border: '1px solid #757575',
    backgroundColor: '#75757551',
    height: '20px',
    borderRadius: '5px',
    color: '#757575',
    cursor: 'pointer',
    transition: 'all 0.25s',
    '&:hover': {
      border: '1px solid #2196f3',
      color: '#2196f3',
      backgroundColor: '#2196f331',
      transition: 'all 0.35s',
    },
  },
  leaveButton: {
    width: 'min(25%, 100px)',
  },
  leaveButtonMobile: {
    display: 'none',
    position: 'absolute',
    borderRadius: '20px',
    width: '40px',
    height: '40px',
    backgroundColor: '#BF101A',
    border: '1px solid #BF101A',
    color: '#F5F5F5',
    cursor: 'pointer',
    zIndex: '10',
    transition: 'all 0.25s',
    '& i': {
      fontSize: '22px',
    },
    '&:hover': {
      backgroundColor: '#a5101A',
      transition: 'all 0.25s',
    },
  },
  '@media (max-width: 425px)': {},
  '@media (max-width: 650px)': {
    linkBox: {
      width: '100% !important',
    },
    leaveButton: {
      display: 'none',
    },
    leaveButtonMobile: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      top: '-25%',
      right: '50%',
      transform: 'translate(20px, 0)',
    },
    roomControllerBox: {
      width: '100%',
    },
  },
  '@media (max-width: 768px)': {
    // header: {
    //   display: 'flex',
    //   flexDirection: 'column',
    //   alignItems: 'flex-start',
    // },
    linkBox: {
      width: '60%',
    },
  },
});

export default useStyles;
