import React, {useMemo} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import FolderOpenIcon from '@material-ui/icons/FolderOpen'
// import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {makeStyles} from '@material-ui/core/styles';
// import LogoImg from '../assets/img/favicon.png'
import AutoRedirectLogin from "../components/AutoRedirectLogin"

import useForm from 'react-hook-form';
import {loadKdbxDB, setSettings} from "../store/setters"
import {selectorSettings} from "../store/getters"
import {useSelector} from "react-redux"
import {decryptByDES, encryptByDES} from "../utils/crypto"
import LockIcon from "@material-ui/icons/Lock"
import {handleUnlockSuccess} from "../utils/db-actions"

function Copyright() {
  const pjson = require('../../package.json');
  const {
    author: {
      name: creator, url: homepage
    }
  } = pjson
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'© ' + new Date().getFullYear() + ' '}
      <Link
        color="inherit"
        component="a"
        onClick={() => {
          window.api.openExternal(homepage)
        }}
      >
        KeeDiary {pjson.version}
      </Link>
      {' by ' + creator}
      <br/>
      {'可信任的日记编辑工具'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      color: theme.palette.text.primary
    },
  },
  root: {
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center'
  },
  paper: {
    marginTop: theme.spacing(0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    width: 76,
    height: 76,
    background: theme.palette.primary.main,
    color: '#fff',
    border: '5px solid',
    boxShadow: theme.shadows[2]
  },
  avatarIcon: {
    fontSize: '38px'
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
  },
  checkbox: {
    marginRight: theme.spacing(1)
  }
}));
// console.log('加载默认设置', signInDefaultConfig)

export default function Login() {
  const classes = useStyles();
  const settings = useSelector(selectorSettings)
  settings.password = useMemo(() => decryptByDES(settings.password), [settings.password])

  const {handleSubmit, register, errors, setValue} = useForm({
    defaultValues: settings
  });

  function forgotPassword() {
    window.api.alert('如果你忘记了密码，可能无法找回。')
  }

  const onSubmit = values => {
    loadKdbxDB(values.dbPath, values.password, values.keyPath).then(db => {
      handleUnlockSuccess(db)

      const newSettings = Object.assign(settings, JSON.parse(JSON.stringify(values)))
      if (!values.rememberPathChecked) {
        delete newSettings.password
      }
      // delete newSettings.keyPath

      // 加密密码
      newSettings.password = encryptByDES(newSettings.password)

      setSettings(newSettings)
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
    <div className={classes.root}>
      <Container component="main" maxWidth="xs">
        <AutoRedirectLogin/>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon className={classes.avatarIcon}/>
          </Avatar>
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
                title="选择数据库文件"
                onClick={() => {
                  handleChooseFile('dbPath', [{name: 'KeePass KDBX 文件', extensions: ['kdbx']}])
                }}
                variant="outlined"
              >
                <FolderOpenIcon/>
              </Button>
            </Box>

            <TextField
              name="password"
              inputRef={register}
              variant="outlined"
              // required
              autoFocus={true}
              fullWidth
              label="数据库密码"
              type="password"
              autoComplete="current-password"
            />

            <Box className={classes.lrBox}>
              <TextField
                name="keyPath"
                inputRef={register}
                variant="outlined"
                label="密钥文件 (可选)"
                InputLabelProps={{shrink: true}}
                // InputProps={{
                //   readOnly: true,
                // }}
                className={classes.inputFlex1}
              />
              <Button
                title="选择密钥文件"
                onClick={() => {
                  handleChooseFile('keyPath', [
                    {name: '所有文件', extensions: ['*']},
                    {name: '密钥文件', extensions: ['key']},
                  ])
                }}
                variant="outlined"
              >
                <FolderOpenIcon/>
              </Button>
            </Box>
            <FormControlLabel
              style={{marginLeft: 0,}}
              control={
                /*<Checkbox name="rememberPathChecked" inputRef={register} />*/
                <input className={classes.checkbox} type="checkbox" name="rememberPathChecked" ref={register}/>
              }
              label="记住密码"
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
                  title="请使用 KeePass 客户端创建数据库"
                >
                  创建数据库
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright/>
        </Box>
      </Container>
    </div>
  )

}
