import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  Input: {
    width: '100%',
    padding: '10px',
    position: 'relative',
    '& input': {
      position: 'relative',
      width: '100%',
      height: '35px',
      border: 'none',
      background: 'rgba(255,255,255,0.05)',
      borderBottom: '2px solid',
      outline: 'none',
      padding: '5px 10px',
      fontSize: '22px',
      color: '#a5a5a5',
      borderColor: ({ theme }) => theme.secondaryColor,
      transition: 'all 0.25s',
      '&:focus': {
        borderColor: ({ theme }) => theme.buttonPrimaryColor,
        transition: 'all 0.35s',
      },
      '&::placeholder': {
        fontSize: '16px',
        fontStyle: 'italic',
        fontWeight: '400',
      },
    },
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
});

export default useStyles;
