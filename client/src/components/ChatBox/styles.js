import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  ChatBox: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '100%',
    height: '100%',
    backgroundColor: ({ theme }) => theme.chatBackgroundColor,
    width: '100%',
  },
});

export default useStyles;
