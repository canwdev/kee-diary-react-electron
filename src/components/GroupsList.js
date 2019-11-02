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
import {globalVars, SET_CURRENT_GROUP_UUID} from "../store"
import {useDispatch, useSelector} from "react-redux"

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  iconWrap: {
    minWidth: '36px'
  }
}));


export default function NestedList() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const dispatch = useDispatch()
  const currentGroupUuid = useSelector(state => state.currentGroupUuid);

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

      list.push({
        uuid: item.uuid.id,
        name: item.name,
        children: deepWalkGroup(children)
      })
    })
    return list
  }

  // TODO: 性能问题
  const db = globalVars.db
  // console.log(db)
  const list = db && deepWalkGroup(db.groups)
  // console.log('result:', list)

  // 递归渲染列表
  function generateVDOM(list, counter = 0) {
    const VDOM = []
    if (!list || list.length === 0) return null

    list.forEach(item => {
      const children = item.children
      const hasChildren = children.length !== 0
      VDOM.push(
        <List
          key={item.uuid}
          component="div"
          disablePadding
          className={counter > 1 ? classes.nested : null}
        >
          <ListItem
            button
            selected={currentGroupUuid === item.uuid}
            onClick={() => {
              handleItemClick(item.uuid)
            }}
          >
            <ListItemIcon
              className={classes.iconWrap}
            ><InboxIcon/></ListItemIcon>
            <ListItemText primary={item.name}/>
            {hasChildren && <ExpandMore/>}
          </ListItem>
          <Collapse in={true} timeout="auto" unmountOnExit>
            {generateVDOM(children, counter + 1)}
          </Collapse>
        </List>
      )
    })

    return VDOM
  }

  function handleItemClick(uuid) {
    // console.log(uuid)
    dispatch({type: SET_CURRENT_GROUP_UUID, value: uuid})
  }

  return (
    <List
      component="nav"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Nested List Items
        </ListSubheader>
      }
      className={classes.root}
    >
      {generateVDOM(list)}
    </List>
  );
}
