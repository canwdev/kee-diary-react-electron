import React from 'react';
import clsx from 'clsx';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import BugReportIcon from '@material-ui/icons/BugReport';
import LockIcon from '@material-ui/icons/Lock';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';
import EventNoteIcon from '@material-ui/icons/EventNote';
import NotesIcon from '@material-ui/icons/Notes';
import HelpIcon from '@material-ui/icons/Help';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';
import EjectIcon from '@material-ui/icons/Eject';
import {Link as RouterLink} from "react-router-dom"
import useReactRouter from "use-react-router"

import {getGlobalDB, selectorDbHasUnsavedChange, selectorUnlocked} from "../store/getters"
import {saveKdbxDB, setUnlocked} from "../store/setters"
import {useSelector} from "react-redux"
import Tooltip from "@material-ui/core/Tooltip"
import useMediaQuery from "@material-ui/core/useMediaQuery"

const drawerWidth = 240;
const SETTINGS_DRAWER_OPEN = 'SETTINGS_DRAWER_OPEN'
const initOpenState = JSON.parse(localStorage.getItem(SETTINGS_DRAWER_OPEN)) || false

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appTitle: {
    fontSize: '18px',
    fontWeight: '500'
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
  hide: {
    display: 'none',
  },
  Toolbar: {
    justifyContent: 'space-between'
  },
  actionButtons: {
    marginLeft: theme.spacing(1)
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

function getDrawerIcon(index) {
  // 抽屉条目图标列表
  const icons = [
    <LockIcon/>,
    <VisibilityIcon/>,
    <NotesIcon/>,
    <BugReportIcon/>,
  ]
  return icons[index]
}

export default function AppContainer(props) {
  const classes = useStyles();
  const theme = useTheme();
  const {location, history} = useReactRouter();

  const [open, setOpen] = React.useState(initOpenState);
  const unlocked = useSelector(selectorUnlocked)
  const dbUnsaved = useSelector(selectorDbHasUnsavedChange)
  const db = getGlobalDB()

  const breakPointSM = useMediaQuery(theme.breakpoints.up('sm'));

  let appTitle = 'KeeDiary'
  if (db && breakPointSM) {
    appTitle += ` - ${db.groups[0].name}`
  }

  const handleDrawerOpen = () => {
    setOpen(true);
    localStorage.setItem(SETTINGS_DRAWER_OPEN, true)
  };

  const handleDrawerClose = () => {
    setOpen(false);
    localStorage.setItem(SETTINGS_DRAWER_OPEN, false)
  };

  const handleCloseDB = () => {
    setUnlocked()
  }

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={classes.appBar}
      >
        <Toolbar className={classes.Toolbar} variant="dense">
          <div style={{display: 'flex', alignItems: 'center'}}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton)}
            >
              <MenuIcon/>
            </IconButton>

            <Typography variant="h6" noWrap className={classes.appTitle}>
              {appTitle}
            </Typography>

          </div>
          <div
            className={classes.actionButtons}
          >
            {
              (unlocked && location.pathname === '/item-detail') && (
                <Tooltip
                  title="返回列表"
                  color="inherit"
                >
                  <IconButton
                    onClick={() => {
                      history.push('/view-list')
                    }}
                  >
                    <ArrowBackIcon/>
                  </IconButton>
                </Tooltip>

              )
            }


            {
              unlocked && [
                {title: '保存更改', action: saveKdbxDB, disabled: !dbUnsaved, icon: <SaveIcon/>},
                {title: '关闭数据库', action: handleCloseDB, icon: <EjectIcon/>},
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
      <Drawer
        className={classes.drawer}
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
        onClose={handleDrawerClose}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <MenuOpenIcon/> : <ChevronRightIcon/>}
          </IconButton>
        </div>
        <Divider/>
        <List>
          {props.router.map((item, index) => {
            return (
              <ListItem
                selected={location.pathname === item.path}
                button
                key={index}
                onClick={handleDrawerClose}
                component={React.forwardRef((props, ref) => <RouterLink to={item.path} innerRef={ref} {...props} />)}
              >
                <ListItemIcon>{getDrawerIcon(index) || <HelpIcon/>}</ListItemIcon>
                <ListItemText primary={item.title}/>
              </ListItem>
            )
          })}
        </List>

        {
          location.pathname === '/view-list' &&
          <>
            <Divider/>
            <List>
              <ListItem button selected
                        onClick={handleDrawerClose}>
                <ListItemIcon><ViewQuiltIcon/></ListItemIcon>
                <ListItemText primary="普通视图"/>
              </ListItem>
              <ListItem button>
                <ListItemIcon><EventNoteIcon/></ListItemIcon>
                <ListItemText primary="日历视图(未实现)"/>
              </ListItem>
            </List>
          </>
        }
      </Drawer>
      <main
        className={classes.content}
      >
        <div className={classes.drawerHeader}/>
        <div style={{height: '50px'}}/>
        {props.children}
      </main>
    </div>
  );
}
