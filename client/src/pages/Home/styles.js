import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  Home: {
    position: 'relative',
    backgroundColor: '#2E2E2E',
    minHeight: '100vh',
    maxWidth: '1140px',
    margin: '0 auto',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
  },
  buttonBox: {
    display: 'flex',
    justifyContent: 'center',
    padding: '1rem',
    width: '45%',
    transition: 'all 0.25s',
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
  mainContent: {
    display: 'flex',
    justifyContent: 'center',
  },
  '@media (max-width: 425px)': {
    buttonBox: {
      width: '100%',
      flexDirection: 'column',
    },
  },
  '@media (max-width: 768px)': {
    buttonBox: {
      width: '100%',
    },
  },
});

export default useStyles;
