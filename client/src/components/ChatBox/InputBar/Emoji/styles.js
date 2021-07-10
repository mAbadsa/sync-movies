import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  emojiContainer: {
    '& section div[class~=emoji-mart-scroll]::-webkit-scrollbar': {
      // overflowY: 'hidden',
      backgroundColor: '#151515',
      width: '6px',
    },
    '& section div[class~=emoji-mart-scroll]::-webkit-scrollbar-thumb': {
      backgroundColor: '#353535',
    },
  },
});

export default useStyles;
