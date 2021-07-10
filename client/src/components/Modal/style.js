import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  Modal: {
    width: 'min(400px, 80%)',
    minWidth: '250px',
    background: ({ theme }) => theme.modalBackground,
    position: 'fixed',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -60%)',
    zIndex: '100',
  },
  MainContent: {
    padding: '0.25rem 2rem 2rem',
    // '& h3': {
    //   color: ({ theme }) => theme.secondaryColor,
    //   fontWeight: 'lighter',
    // },
  },
  ModelCloseIconBox: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0.75rem 0.75rem 0 0',
    '& i': {
      color: '#c11010',
      fontSize: '28px',
      cursor: 'pointer',
      transition: 'color 0.25s',
      '&:hover': {
        color: '#f50500',
        transition: 'color 0.25s',
      },
    },
  },
});

export default useStyles;
