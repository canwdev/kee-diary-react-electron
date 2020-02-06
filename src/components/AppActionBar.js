import AppBar from '@material-ui/core/AppBar';
import Toolbar from "@material-ui/core/Toolbar"
import IconButton from "@material-ui/core/IconButton"
import clsx from "clsx"
import MenuIcon from "@material-ui/icons/Menu"
import Typography from "@material-ui/core/Typography"
import {saveKdbxDB, setUnlocked} from "../store/setters"
import Tooltip from "@material-ui/core/Tooltip"
import React from "react"
import {makeStyles, useTheme} from "@material-ui/core/styles"
import {useSelector} from "react-redux"
import {selectorDbHasUnsavedChange, selectorUnlocked} from "../store/getters"
import LockIcon from '@material-ui/icons/Lock';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';
import EjectIcon from '@material-ui/icons/Eject';
import useMediaQuery from "@material-ui/core/useMediaQuery/useMediaQuery"
import useReactRouter from "use-react-router"

const useStyles = makeStyles(theme => ({
  appTitle: {
    fontSize: '18px',
    fontWeight: '500',
    maxWidth: '230px'
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    userSelect: 'none'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },

  Toolbar: {
    justifyContent: 'space-between'
  },
  actionButtons: {
    marginLeft: theme.spacing(1)
  }
}));

export default function AppActionBar(props) {
  const classes = useStyles();
  const theme = useTheme();
  const breakPointSM = useMediaQuery(theme.breakpoints.up('sm'));
  const unlocked = useSelector(selectorUnlocked)
  const {location, history} = useReactRouter();

  const dbUnsaved = useSelector(selectorDbHasUnsavedChange)

  const {db, handleDrawerOpen} = props

  let appTitle = 'KeeDiary'
  if (db && breakPointSM) {
    appTitle += ` - ${db.groups[0].name}`
  }

  const handleCloseDB = () => {
    setUnlocked()
  }

  return (
    <AppBar
      position="fixed"
      className={classes.appBar}
    >
      <Toolbar className={classes.Toolbar} variant="dense">
        <div style={{display: 'flex', alignItems: 'center'}}>
          {
            unlocked ? (
              (location.pathname === '/view-list') ? (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  className={clsx(classes.menuButton)}
                >
                  <MenuIcon/>
                </IconButton>
              ) : (
                <IconButton
                  color="inherit"
                  onClick={() => {
                    history.push('/view-list')
                  }}
                  title="返回 (Esc)"
                  edge="start"
                  className={clsx(classes.menuButton)}
                >
                  <ArrowBackIcon/>
                </IconButton>
              )
            ) : (
              <IconButton
                color="inherit"
                edge="start"
                disabled={false}
                className={clsx(classes.menuButton)}
                onClick={handleDrawerOpen}
              >
                <LockIcon/>
              </IconButton>
            )
          }

          <Typography
            variant="h6"
            noWrap
            className={classes.appTitle}
            onClick={() => {
              if (unlocked) {
                history.push('/view-list')
              }
            }}
          >
            {appTitle}
          </Typography>

        </div>
        <div
          className={classes.actionButtons}
        >

          {
            unlocked && [
              {title: '保存更改 (Ctrl+S)', action: saveKdbxDB, disabled: !dbUnsaved, icon: <SaveIcon/>},
              {title: '关闭数据库 (Ctrl+L)', action: handleCloseDB, icon: <EjectIcon/>},
            ].map((item, index) => {
              return (
                <Tooltip
                  title={item.title}
                  key={index}
                >
                    <span>
                      <IconButton
                        color="inherit"
                        aria-label={item.title}
                        disabled={item.disabled}
                        onClick={item.action}
                      >
                      {item.icon}
                    </IconButton>
                    </span>
                </Tooltip>
              )
            })
          }
        </div>
      </Toolbar>
    </AppBar>
  )
}
