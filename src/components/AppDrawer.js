import IconButton from "@material-ui/core/IconButton"
import Divider from "@material-ui/core/Divider"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import Drawer from "@material-ui/core/Drawer"
import React, {useState} from "react"
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';
import EventNoteIcon from '@material-ui/icons/EventNote';
import {makeStyles, useTheme} from "@material-ui/core/styles"
import useReactRouter from "use-react-router"
import {useSelector} from "react-redux"
import {selectorIsListView} from "../store/getters"
import {setIsListView} from "../store/setters"
import Switch from "@material-ui/core/Switch"

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
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
}));

export default function AppDrawer(props) {
  const classes = useStyles()
  const theme = useTheme()

  const {location} = useReactRouter()
  const isListView = useSelector(selectorIsListView)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const {open, handleDrawerClose} = props

  const setListView = (flag) => {
    setIsListView(flag)
    handleDrawerClose()
  }

  return (
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

        {
          location.pathname === '/view-list' &&
          <>
            {
              [
                {title: '列表视图', icon: <ViewQuiltIcon/>, isListView: true},
                {title: '日历视图', icon: <EventNoteIcon/>, isListView: false},
              ].map(item => (
                <ListItem
                  button
                  selected={isListView === item.isListView}
                  onClick={() => {
                    setListView(item.isListView)
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title}/>
                </ListItem>
              ))
            }
            <Divider/>
          </>
        }

        <ListItem
          button
          onClick={() => {
            setIsDarkMode(v => !v)
          }}
        >
          <ListItemIcon>
            <Switch
              size="small"
              checked={isDarkMode}
            />
          </ListItemIcon>
          <ListItemText primary="黑暗模式"/>
        </ListItem>
      </List>
    </Drawer>
  )
}
