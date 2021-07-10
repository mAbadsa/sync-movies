import { useTheme } from 'react-jss';

import useStyles from './styles';

function MessagesBox() {
  const theme = useTheme();
  const classes = useStyles({ theme });
  return <div className={classes.MessagesBox} />;
}

export default MessagesBox;
