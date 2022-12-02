import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flex: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    height: '100vh',
    overflow: 'scroll',
  }
}));
