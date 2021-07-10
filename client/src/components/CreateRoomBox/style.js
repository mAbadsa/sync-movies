import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  CreateRoomBox: {
    background: ({ theme }) => theme.modalBackground,
    '& h3': {
      color: ({ theme }) => theme.secondaryColor,
      fontWeight: 'lighter',
    },
  },
});

export default useStyles;
