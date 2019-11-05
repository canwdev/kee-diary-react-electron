import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
// import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import swal from 'sweetalert';
import {iconMap} from "../utils/icon-map"
import {setCurrentGroupUUID, setDbHasUnsavedChange} from "../store/setters"
import {selectorCurrentGroupUuid, getGlobalDB} from "../store/getters"
import {useSelector} from "react-redux"
// import StarBorder from '@material-ui/icons/StarBorder';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    minWidth: '300px',
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(2),
  },
  iconWrap: {
    minWidth: '32px',
    fontSize: '18px'
  }
}));


// 递归遍历数据库 groups
function deepWalkGroup(node, counter = 0) {
  // console.log('TODO: 性能优化 ▲ deepWalkGroup')
  const list = []
  if (!node || node.length === 0) return list

  node.forEach((item) => {
    const children = item.groups

    list.push({
      icon: iconMap[item.icon],
      uuid: item.uuid,
      name: item.name,
      index: counter,
      children: deepWalkGroup(children, counter + 1),
      original: item
    })
  })
  return list
}

export default function NestedList() {
  const [on, setOn] = useState(false)

  const classes = useStyles();
  const currentGroupUuid = useSelector(selectorCurrentGroupUuid)

  // 右键菜单
  const menuInitState = {
    mouseX: null,
    mouseY: null,
    item: null
  };
  const [menuState, setMenuState] = useState(menuInitState);
  const handleRightClick = (event, item) => {
    event.preventDefault();
    setMenuState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      item
    });
  };
  const handleMenuItemClick = (type) => {
    setMenuState(menuInitState)
    switch (type) {
      case 'rename':
        handleEdit(menuState.item)
        return
      case 'delete':
        handleDelete(menuState.item)
        return
      default:
        return
    }
  };

  // 数据库加载
  const db = getGlobalDB() || {}
  const groupsFiltered = deepWalkGroup(db.groups)

  function handleItemClick(item) {
    // console.log('点击群组项', item)
    setCurrentGroupUUID(item.uuid)
  }

  function handleEdit(item) {
    swal({
      title: `重命名《${item.name}》`,
      content: {
        element: "input",
        attributes: {
          value: item.name
        },
      },
      buttons: true,
      closeOnClickOutside: false,
    })
      .then((value) => {
        if (value && value !== item.name) {
          item.original.name = value
          setDbHasUnsavedChange()
          setCurrentGroupUUID(item.uuid)
        }
      });
    // console.log('handleEdit', item)
  }

  function handleDelete(item) {
    const recycleBinEnabled = db.meta.recycleBinEnabled
    const isRecycleBin = item.uuid.id === db.meta.recycleBinUuid.id

    swal({
      title: isRecycleBin ? '清空回收站' : '确认删除',
      text: isRecycleBin ? '确定要删除回收站中的所有数据吗？' :
        (recycleBinEnabled ? `确定要将《${item.name}》移动至回收站吗？` : `确定要永久删除《${item.name}》吗？`),
      icon: "warning",
      buttons: ["取消", "确认"],
      dangerMode: true,
    }).then((result) => {
      if (result) {
        db.remove(db.getGroup(item.uuid))
        setDbHasUnsavedChange()
        setCurrentGroupUUID(item.uuid)
      }
    });

  }

  /**
   * 递归生成虚拟DOM
   * @param list 传 groupsFiltered
   * @returns VDOM
   */
  function generateVDOM(list) {
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
          className={item.index > 0 ? classes.nested : null}
        >
          <ListItem
            button
            selected={currentGroupUuid === item.uuid}
            onClick={() => {
              handleItemClick(item)
            }}
            onContextMenu={(event) => {
              handleRightClick(event, item)
            }}
          >
            <ListItemIcon
              className={classes.iconWrap}
            >
              <i className={`fa fa-${item.icon}`}/>
            </ListItemIcon>
            <ListItemText primary={item.name}/>
            {hasChildren && <ExpandMore/>}
          </ListItem>
          <Collapse in={true} timeout="auto" unmountOnExit>
            {generateVDOM(children)}
          </Collapse>
        </List>
      )
    })

    return VDOM
  }

  return (
    <>
      <List
        component="nav"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            群组列表 <button onClick={() => {
            setOn(!on)
          }}>触发更新{JSON.stringify(on)}</button>
          </ListSubheader>
        }
        className={classes.root}
      >
        {generateVDOM(groupsFiltered) }
      </List>

      {
        menuState.item && (
          <Menu
            keepMounted
            open={menuState.mouseY !== null}
            onClose={handleMenuItemClick}
            anchorReference="anchorPosition"
            anchorPosition={
              menuState.mouseY !== null && menuState.mouseX !== null
                ? {top: menuState.mouseY, left: menuState.mouseX}
                : undefined
            }
          >
            <MenuItem onClick={() => {
              handleMenuItemClick('rename')
            }}>重命名</MenuItem>
            {
              menuState.item.index !== 0 &&
              <MenuItem onClick={() => {
                handleMenuItemClick('delete')
              }}>删除群组</MenuItem>
            }
          </Menu>
        )
      }

    </>
  );
}
