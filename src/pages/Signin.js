import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {makeStyles} from '@material-ui/core/styles';
import useForm from 'react-hook-form';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        KeepassDiary
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


function forgotPassword() {
  alert('如果你忘记了密码，可能永远也找不回了。')
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  lrBox: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1)
  },
  inputFlex1: {
    flex: 1,
    marginRight: theme.spacing(1)
  }
}));

export default function SignIn() {
  const classes = useStyles();
  const {handleSubmit, register, errors} = useForm();
  const onSubmit = values => {
    console.log(values);
  };

  return (
    <Container component="main" maxWidth="xs">
      {/*<CssBaseline />*/}
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          打开数据库
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Box className={classes.lrBox}>
            <TextField
              name="dbPath"
              inputRef={register({
                required: '请选择数据库文件'
              })}
              error={Boolean(errors.dbPath)}
              helperText={
                errors.dbPath ? errors.dbPath.message : null
              }
              value="‪C:\Users\CAN\Documents\Password\workdb.kdbx"
              variant="outlined"
              label="数据库文件 *"
              InputProps={{
                readOnly: true,
              }}
              className={classes.inputFlex1}
            />
            <Button variant="outlined">选择文件</Button>
          </Box>

          <TextField
            name="password"
            inputRef={register}
            variant="outlined"
            // required
            fullWidth
            label="密码"
            type="text"
            autoComplete="current-password"
          />

          <Box className={classes.lrBox}>
            <TextField
              name="keyPath"
              inputRef={register}
              variant="outlined"
              label="密钥文件（可选）"
              InputProps={{
                readOnly: true,
              }}
              className={classes.inputFlex1}
            />
            <Button variant="outlined">选择文件</Button>
          </Box>

          <FormControlLabel
            name="isSaveKeyPath"
            inputRef={register}
            control={<Checkbox color="primary"/>}
            label="记住密钥位置"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            解密
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                component="button"
                type="button"
                onClick={forgotPassword}
                variant="body2">
                忘记密码
              </Link>
            </Grid>
            <Grid item>
              <Link
                // href="https://keepass.info/"
                component="button"
                type="button"
                variant="body2"
                onClick={() => {window.api.openExternal('https://keepass.info/')}}
              >
                {"没有数据库? 创建一个"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright/>
      </Box>
    </Container>
  )

}
