import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {getGlobalDB} from "../store/getters"
import AppActionBar from "./AppActionBar"
import AppDrawer from "./AppDrawer"
import Preview from "./Preview"

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    minHeight: '100%',
    background: theme.palette.background.default
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

const SETTINGS_DRAWER_OPEN = 'SETTINGS_DRAWER_OPEN'
const initOpenState = JSON.parse(localStorage.getItem(SETTINGS_DRAWER_OPEN)) || false

export default function AppContainer(props) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(initOpenState);
  const db = getGlobalDB()

  const handleDrawerOpen = () => {
    setOpen(true);
    localStorage.setItem(SETTINGS_DRAWER_OPEN, true)
  };

  const handleDrawerClose = () => {
    setOpen(false);
    localStorage.setItem(SETTINGS_DRAWER_OPEN, false)
  };

  return (
    <div className={classes.root}>
      <AppActionBar
        db={db}
        handleDrawerOpen={handleDrawerOpen}
      />
      <AppDrawer
        open={open}
        handleDrawerClose={handleDrawerClose}
      />
      <main
        className={classes.content}
      >
        <div className={classes.drawerHeader}/>
        <div style={{height: '50px'}}/>
        {props.children}
      </main>
      <Preview/>
    </div>
  );
}
