import React, {useMemo} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {makeStyles} from '@material-ui/core/styles';
import LogoImg from '../assets/img/favicon.png'
import AutoRedirectLogin from "../components/AutoRedirectLogin"

import useForm from 'react-hook-form';
import {loadKdbxDB, setGlobalDB, setSettings, setUnlocked} from "../store/setters"
import {selectorSettings} from "../store/getters"
import {useSelector} from "react-redux"
import {decryptByDES, encryptByDES} from "../utils/crypto"

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © ' + new Date().getFullYear() + ' '}
      <Link color="inherit" component="button">KeeDiary</Link>
      {' by canwdev'}
      <br/>
      {'可信任的日记编辑工具(或许)'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    width: 88,
    height: 88,
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
    margin: theme.spacing(1.5, 0),
  },
  inputFlex1: {
    flex: 1,
    marginRight: theme.spacing(1)
  }
}));
// console.log('加载默认设置', signInDefaultConfig)

export default function Login() {
  const classes = useStyles();
  const settings = useSelector(selectorSettings)
  settings.password = useMemo(() => decryptByDES(settings.password), [settings])

  const {handleSubmit, register, errors, setValue} = useForm({
    defaultValues: settings
  });

  function forgotPassword() {
    window.api.alert('如果你忘记了密码，可能永远也找不回了。')
  }

  const onSubmit = values => {
    loadKdbxDB(values.dbPath, values.password, values.keyPath).then(db => {
      // console.log('数据库已解锁！', db)
      setGlobalDB(db)
      setUnlocked(true)

      const settings = JSON.parse(JSON.stringify(values))
      if (!values.rememberPathChecked) {

        delete settings.keyPath
        delete settings.password
      }

      // 加密密码
      settings.password = encryptByDES(settings.password)

      setSettings(settings)
    }).catch(e => {
      console.error(e)
      let message = e.message
      if (e.code === 'InvalidKey') message = '密码或密钥错误'
      window.api.showErrorBox(e.name + ': ' + e.code, message)
    })

  };


  /**
   * 选择文件
   * name：对应表单name
   * filters：文件过滤器，[{name: 'KeePass KDBX 文件', extensions: ['kdbx']}]
   **/
  const handleChooseFile = (name, filters) => {
    const results = window.api.openFileChooser(filters)
    // console.log(results)
    if (results && results[0]) {
      setValue(name, results[0])
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <AutoRedirectLogin/>
      <div className={classes.paper}>
        <Avatar className={classes.avatar} src={LogoImg}/>
        <Typography component="h1" variant="h5">
          打开 KDBX 数据库
        </Typography>

        <form
          className={classes.form}
          onSubmit={handleSubmit(onSubmit)}
        >
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
              variant="outlined"
              label="数据库文件 *"
              InputLabelProps={{shrink: true}}
              className={classes.inputFlex1}
            />
            <Button
              onClick={() => {
                handleChooseFile('dbPath', [{name: 'KeePass KDBX 文件', extensions: ['kdbx']}])
              }}
              variant="outlined">选择文件</Button>
          </Box>

          <TextField
            name="password"
            inputRef={register}
            variant="outlined"
            // required
            fullWidth
            label="密码"
            type="password"
            autoComplete="current-password"
          />

          <Box className={classes.lrBox}>
            <TextField
              name="keyPath"
              inputRef={register}
              variant="outlined"
              label="密钥文件（可选）"
              InputLabelProps={{shrink: true}}
              // InputProps={{
              //   readOnly: true,
              // }}
              className={classes.inputFlex1}
            />
            <Button
              onClick={() => {
                handleChooseFile('keyPath', [
                  {name: '所有文件', extensions: ['*']},
                  {name: '密钥文件', extensions: ['key']},
                ])
              }}
              variant="outlined"
            >选择文件</Button>
          </Box>
          <FormControlLabel

            control={
              /*<Checkbox name="rememberPathChecked" inputRef={register} />*/
              <input type="checkbox" name="rememberPathChecked" ref={register}/>
            }
            label="记住密码和密钥位置"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            解锁
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                component="button"
                type="button"
                onClick={forgotPassword}
                variant="body2"
              >
                忘记密码
              </Link>
            </Grid>
            <Grid item>
              <Link
                // href="https://keepass.info/"
                component="button"
                type="button"
                variant="body2"
                onClick={() => {
                  window.api.openExternal('https://keepass.info/')
                }}
              >
                {"没有数据库? 创建一个"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright/>
      </Box>
    </Container>
  )

}
