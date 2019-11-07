import React, {useEffect, useState} from 'react';
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
import swal from 'sweetalert2';
import {iconMap} from "../utils/icon-map"
import {setCurrentEntry, setCurrentGroupUuid, setDbHasUnsavedChange} from "../store/setters"
import {getGlobalDB, selectorCurrentGroupUuid} from "../store/getters"
import {useSelector} from "react-redux"
import Divider from "@material-ui/core/Divider"
import useReactRouter from "use-react-router"
import {formatDate} from "../utils"
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
      _ref: item
    })
  })
  return list
}

export default function NestedList() {
  const [on, setOn] = useState(false) // 仅在目前用于强制刷新组件状态，会有严重性能问题

  const {history} = useReactRouter();
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
    const group = menuState.item._ref
    switch (type) {
      case 'addGroup':
        return handleAddGroup(group)
      case 'addEntry':
        return handleAddEntry(group)
      case 'rename':
        return handleEdit(group)
      case 'delete':
        return handleDelete(group)
      default:
        return
    }
  };

  // 数据库加载
  const db = getGlobalDB() || {}
  const groupsFiltered = deepWalkGroup(db.groups)

  function handleItemClick(item) {
    // console.log('点击群组项', item)
    setCurrentGroupUuid(item.uuid)
  }

  useEffect(() => {
    if (!currentGroupUuid && groupsFiltered && groupsFiltered[0]) { // 自动选择第一个群组
      setCurrentGroupUuid(groupsFiltered[0].uuid)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleAddGroup(group) {

    swal.fire({
      title: '添加群组',
      input: 'text',
      inputValue: '新群组',
      showCancelButton: true,
    }).then((result) => {
      if (!result.dismiss && result.value) {
        const newGroup = db.createGroup(group, result.value)
        setDbHasUnsavedChange()
        setCurrentGroupUuid(newGroup.uuid)
      }
    })
  }

  function handleAddEntry(group) {
    const newEntry = db.createEntry(group)
    newEntry.fields.Title = '新条目 - ' + formatDate(new Date())
    console.log(newEntry)
    setCurrentGroupUuid(group.uuid)
    setCurrentEntry(newEntry)
    history.push('/item-detail')
  }

  function handleEdit(group) {
    const name = group.name
    swal.fire({
      title: `重命名《${name}》`,
      input: 'text',
      inputValue: name,
      showCancelButton: true,
    })
      .then((result) => {
        const value = result.value
        if (value && value !== name) {
          group.name = value
          setDbHasUnsavedChange()
          setCurrentGroupUuid(group.uuid)
          setOn(!on)
        }
      });
  }

  function handleDelete(group) {
    const recycleBinEnabled = db.meta.recycleBinEnabled
    const isRecycleBin = group.uuid.id === db.meta.recycleBinUuid.id

    const name = group.name

    swal.fire({
      title: isRecycleBin ? '清空回收站' : '确认删除',
      text: isRecycleBin ? '确定要删除回收站中的所有数据吗？' :
        (recycleBinEnabled ? `确定要将《${name}》移动至回收站吗？` : `确定要永久删除《${name}》吗？其中的所有条目将被删除！`),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.value) {
        db.remove(db.getGroup(group.uuid))
        setDbHasUnsavedChange()
        setCurrentGroupUuid(null)
        setOn(!on)
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
            群组列表
            <button
              title="强制刷新组件状态"
              onClick={() => {
                setOn(!on)
              }}
            >{JSON.stringify(on)}</button>
          </ListSubheader>
        }
        className={classes.root}
      >
        {generateVDOM(groupsFiltered)}
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
              handleMenuItemClick('addGroup')
            }}>添加群组</MenuItem>
            <MenuItem onClick={() => {
              handleMenuItemClick('addEntry')
            }}>添加条目</MenuItem>
            <Divider/>
            <MenuItem onClick={() => {
              handleMenuItemClick('rename')
            }}>重命名</MenuItem>
            <MenuItem
              disabled={menuState.item.index === 0}
              onClick={() => {
                handleMenuItemClick('delete')
              }}
            >删除群组</MenuItem>
          </Menu>
        )
      }

    </>
  );
}
