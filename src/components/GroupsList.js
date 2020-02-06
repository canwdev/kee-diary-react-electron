import React, {useEffect, useMemo, useState} from 'react';
import ReactDOM from 'react-dom'
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Divider from "@material-ui/core/Divider"

import Typography from '@material-ui/core/Typography';
import AddBoxIcon from '@material-ui/icons/AddBox';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteIcon from '@material-ui/icons/Delete';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
// import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import swal from 'sweetalert2';
import {setCurrentEntry, setCurrentGroupUuid, setDbHasUnsavedChange} from "../store/setters"
import {
  getGlobalDB,
  getIsRecycleBin,
  getIsRecycleBinEnabled,
  selectorCurrentGroupUuid,
  selectorIsDarkMode
} from "../store/getters"
import {useSelector} from "react-redux"
import useReactRouter from "use-react-router"
import {deepWalkGroup, formatDate} from "../utils"
import clsx from "clsx"
import {menuIconWrap} from "../assets/styles/commonStyles"
// import StarBorder from '@material-ui/icons/StarBorder';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(2),
  },
  iconWrap: menuIconWrap,
  targetGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    lineHeight: '30px',
    "&:hover": {
      backgroundColor: theme.palette.grey["300"]
    }
  },
  listItemText: {
    width: '100px',
    display: 'inline-block',
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  disabled: {
    pointerEvents: 'none',
    opacity: 0.5
  }
}));

export default function NestedList() {
  const classes = useStyles();
  const isDarkMode = useSelector(selectorIsDarkMode)

  const {history} = useReactRouter();
  const [updater, setUpdater] = useState(false) // 用于强制刷新组件状态
  const currentGroupUuid = useSelector(selectorCurrentGroupUuid)

  // 数据库加载
  const db = getGlobalDB() || {}

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
        return handleEditGroup(group)
      case 'move':
        return handleMoveToGroup(group)
      case 'delete':
        return handleDeleteGroup(group)
      default:
        return
    }
  };

  const groupsFiltered = useMemo(() => {
    return deepWalkGroup(db.groups)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updater, currentGroupUuid])

  useEffect(() => {
    if (!currentGroupUuid && groupsFiltered && groupsFiltered[0]) { // 自动选择第一个群组
      setCurrentGroupUuid(groupsFiltered[0].uuid)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleItemClick = (item) => {
    // console.log('点击群组项', item)
    setCurrentGroupUuid(item.uuid)
  }

  const handleAddGroup = (group) => {

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

  const handleAddEntry = (group) => {
    const newEntry = db.createEntry(group)
    newEntry.fields.Title = '新条目 - ' + formatDate(new Date())
    console.log(newEntry)
    setCurrentGroupUuid(group.uuid)
    setCurrentEntry(newEntry)
    setDbHasUnsavedChange()
    history.push('/item-detail')
  }

  const handleEditGroup = (group) => {
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
          setUpdater(v => !v)
        }
      });
  }

  const handleMoveToGroup = (group) => {
    let selectedGroup = null

    const generateGroupSelector = (list, counter = 0) => {
      const VDOM = []
      if (!list || list.length === 0) return null

      list.forEach(item => {
        const children = item.children
        VDOM.push(
          <div
            key={item.uuid}
            className={clsx(
              classes.nested, {
                [classes.disabled]: group.uuid.id === item._ref.uuid.id,
              }
            )}
          >
            <label className={classes.targetGroup}>
              <input
                type="radio"
                name="target-group"
                disabled={group.uuid.id === item._ref.uuid.id}
                onClick={() => {
                  selectedGroup = item._ref
                }}
              />
              <span>{item.name}</span>
            </label>
            {generateGroupSelector(children, counter + 1)}
          </div>
        )
      })
      return VDOM
    }

    swal.fire({
      title: '请选择目标群组',
      html: ReactDOM.render((
        <div style={{textAlign: 'left'}}>
          {generateGroupSelector(groupsFiltered)}
        </div>
      ), document.createElement('div')),
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        return selectedGroup
      }
    }).then(res => {
      if (!res.dismiss && res.value) {
        db.move(group, selectedGroup);
        setDbHasUnsavedChange()
        setCurrentGroupUuid(group.uuid)
        setUpdater(v => !v)
      }
    })
  }

  const handleDeleteGroup = (group) => {
    const isRecycleBin = getIsRecycleBin(group.uuid)

    const name = group.name

    swal.fire({
      title: isRecycleBin ? '清空回收站' : '确认删除',
      text: isRecycleBin ? '确定要删除回收站中的所有数据吗？' :
        (getIsRecycleBinEnabled() ? `确定要将《${name}》移动至回收站吗？` : `确定要永久删除《${name}》吗？其中的所有条目将被删除！`),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.value) {
        db.remove(db.getGroup(group.uuid))
        setDbHasUnsavedChange()
        setCurrentGroupUuid(null)
        setUpdater(v => !v)
      }
    });

  }

  /**
   * 生成Group列表 DOM（递归生成虚拟DOM）
   * @param list 传 groupsFiltered
   */
  const generateGroupListVDOM = (list) => {
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
            <ListItemText
              className={classes.listItemText}
              primary={item.name}
            />
            {hasChildren && <ExpandMoreIcon/>}
          </ListItem>
          <Collapse in={true} timeout="auto" unmountOnExit>
            {generateGroupListVDOM(children)}
          </Collapse>
        </List>
      )
    })

    return VDOM
  }

  const generatedGroupList = useMemo(() => {
    return generateGroupListVDOM(groupsFiltered)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updater, currentGroupUuid, isDarkMode])

  const generatedMenu = useMemo(() => {
    const item = menuState.item
    const menuList = [
      {
        icon: <AddCircleIcon fontSize="small"/>,
        title: '添加条目',
        action: 'addEntry'
      },
      {
        icon: <AddBoxIcon fontSize="small"/>,
        title: '添加群组',
        action: 'addGroup'
      },
      {isDivider: true},
      {
        icon: <BorderColorIcon fontSize="small"/>,
        title: '重命名',
        action: 'rename'
      },
      {
        disabled: item && item.index === 0,
        icon: <DoubleArrowIcon fontSize="small"/>,
        title: '移动',
        action: 'move'
      },
      {
        disabled: item && item.index === 0,
        icon: <DeleteIcon fontSize="small"/>,
        title: item && getIsRecycleBin(item._ref.uuid) ? '清空回收站' : '删除群组',
        action: 'delete'
      }
    ]
    return (
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
        {
          menuList.map((item, index) => {
            if (item.isDivider) {
              return <Divider key={index}/>
            }
            return (
              <MenuItem
                key={index}
                disabled={item.disabled}
                onClick={() => {
                  handleMenuItemClick(item.action)
                }}
              >
                <ListItemIcon className={classes.iconWrap}>
                  {item.icon}
                </ListItemIcon>
                <Typography variant="inherit">{item.title}</Typography>
              </MenuItem>
            )

          })
        }

      </Menu>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuState])

  return (
    <>
      <List
        component="nav"

        className={classes.root}
      >
        {generatedGroupList}
      </List>

      {
        generatedMenu
      }

    </>
  );
}
