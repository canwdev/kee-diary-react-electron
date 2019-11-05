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
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
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

import Button from "@material-ui/core/Button"
import {Link as RouterLink} from "react-router-dom"
import useReactRouter from "use-react-router"

import {getGlobalDB, getSettings, selectorDbHasUnsavedChange, selectorUnlocked} from "../store/getters"
import {saveKdbxDB, setUnlocked} from "../store/setters"
import {useSelector} from "react-redux"

const drawerWidth = 240;
const SETTINGS_DRAWER_OPEN = 'SETTINGS_DRAWER_OPEN'
const initOpenState = JSON.parse(localStorage.getItem(SETTINGS_DRAWER_OPEN)) || false

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    userSelect: 'none'
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
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
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function AppContainer(props) {
  const classes = useStyles();
  const getIcon = (index) => {
    // 抽屉条目图标列表
    const icons = [
      <LockIcon/>,
      <VisibilityIcon/>,
      <NotesIcon/>,
      <BugReportIcon/>,
    ]
    return icons[index]
  }
  const theme = useTheme();
  const {location} = useReactRouter();

  const [open, setOpen] = React.useState(initOpenState);
  const unlocked = useSelector(selectorUnlocked)
  const dbUnsaved = useSelector(selectorDbHasUnsavedChange)
  const db = getGlobalDB()
  let appTitle = 'KeeDiary'
  if (db) {
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
  const handleSaveDB = () => {
    const settings = getSettings()
    saveKdbxDB(settings.dbPath)
  }

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar className={classes.Toolbar}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon/>
            </IconButton>
            <Typography variant="h6" noWrap>
              {appTitle}
            </Typography>
          </div>
          <div>
            {
              unlocked && [
                {title: '保存更改', action: handleSaveDB, disabled: !dbUnsaved},
                {title: '关闭数据库', action: handleCloseDB},
              ].map((item, index) => {
                return (<Button
                  variant="outlined"
                  color="inherit"
                  onClick={item.action}
                  key={index}
                  className={classes.actionButtons}
                  disabled={item.disabled}
                >{item.title}</Button>)
              })
            }
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
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
                component={React.forwardRef((props, ref) => <RouterLink to={item.path} innerRef={ref} {...props} />)}
              >
                <ListItemIcon>{getIcon(index) || <HelpIcon/>}</ListItemIcon>
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
              <ListItem button selected>
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
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader}/>
        {props.children}
      </main>
    </div>
  );
}
