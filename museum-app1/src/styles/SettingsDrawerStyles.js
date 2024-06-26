import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  drawer: {
    width: 240,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: 240,
      boxSizing: 'border-box',
      backgroundColor: '#123456',
      overflow: 'hidden'
    }
  },
  drawerHeader: {
    padding: theme.spacing(2),
    color: theme.palette.primary.contrastText,
    overflow: 'hidden',
    backgroundColor: '#123456',
  },
  drawerHeaderText: {
    color: '#FFFFFF'
  },
  listItemButton: {
    '&:hover': {
      backgroundColor: '#fdaa17',
      color: 'black',
    },
    '&.Mui-selected': {
      backgroundColor: '#ffd617',
      '&:hover': {
        backgroundColor: '#fdaa17',
      },
    }
  }
}));
