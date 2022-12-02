import { makeStyles } from '@material-ui/core/styles';
const drawerWidth = 76
export default makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.palette.background.default,
    height: '100vh',
    width: `calc(100vw - ${drawerWidth}px)`,
    overflow: 'scroll',
  }
}));
