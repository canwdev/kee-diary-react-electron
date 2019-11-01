import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import {globalVars} from "../store"

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));


export default function NestedList() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  let groups = []

  // 递归遍历数据库 groups
  function deepWalkGroup(node) {
    const list = []
    if (!node || node.length === 0) return list

    node.forEach((item) => {
      const children = item.groups
      const temp = {}
      temp.name = item.name
      temp.children = deepWalkGroup(children)
      list.push(temp)
    })
    return list
  }

  const db = globalVars.db
  if (db) {
    const group = deepWalkGroup(db.groups)
    console.log('result:', group)
  }

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Nested List Items
        </ListSubheader>
      }
      className={classes.root}
    >
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <InboxIcon/>
        </ListItemIcon>
        <ListItemText primary="Inbox"/>
        {open ? <ExpandLess/> : <ExpandMore/>}
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <StarBorder/>
            </ListItemIcon>
            <ListItemText primary="Starred"/>
          </ListItem>
        </List>
      </Collapse>

    </List>
  );
}
