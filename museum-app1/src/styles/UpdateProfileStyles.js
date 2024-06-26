import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()((theme) => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90vh',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.default,
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
    backgroundColor: '#f5f5f5',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    width: '80%',
    maxWidth: '600px',
  },
  title: {
    marginBottom: theme.spacing(2),
    color: '#123456',
  },
  inputField: {
    marginBottom: theme.spacing(2),
    backgroundColor: 'white',
  },
  actionButton: {
    backgroundColor: '#123456',
    '&:hover': {
      backgroundColor: '#ffd617',
      color: 'black',
    },
    width: '48%',
  },
  deleteButton: {
    width: '48%',
    '&:hover': {
      backgroundColor: '#ffd617',
      color: 'black',
    },
  }
}));
