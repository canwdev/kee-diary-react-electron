import React, {forwardRef, useImperativeHandle, useMemo, useState} from 'react';
import AddCircleIcon from "@material-ui/icons/AddCircle"
import AddBoxIcon from "@material-ui/icons/AddBox"
import BorderColorIcon from "@material-ui/icons/BorderColor"
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow"
import DeleteIcon from "@material-ui/icons/Delete"
import {getGlobalDB, getIsRecycleBin} from "../../store/getters"
import Menu from "@material-ui/core/Menu"
import Divider from "@material-ui/core/Divider"
import MenuItem from "@material-ui/core/MenuItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import Typography from "@material-ui/core/Typography"
import {makeStyles} from "@material-ui/core"
import {menuIconWrap} from "../../assets/styles/commonStyles"
import swal from "sweetalert2"
import {setCurrentEntry, setCurrentGroupUuid, setDbHasUnsavedChange, setGroupListByDB} from "../../store/setters"
import {formatDate} from "../../utils"
import useReactRouter from "use-react-router"
import {confirmDeleteGroup, confirmMoveToGroupChooser, handleChangeIcon} from "../../utils/db-actions"
import StarIcon from "@material-ui/icons/Star"

const useStyles = makeStyles(theme => ({
  menuIconWrap,
}))

export const MENU_ACTION_ADD_GROUP = 'MENU_ACTION_ADD_GROUP'
export const MENU_ACTION_ADD_ENTRY = 'MENU_ACTION_ADD_ENTRY'
export const MENU_ACTION_CHANGE_ICON = 'MENU_ACTION_CHANGE_ICON'
export const MENU_ACTION_RENAME = 'MENU_ACTION_RENAME'
export const MENU_ACTION_MOVE = 'MENU_ACTION_MOVE'
export const MENU_ACTION_DELETE = 'MENU_ACTION_DELETE'

export default forwardRef((props, refs) => {
  const {
    setUpdater,
  } = props
  const classes = useStyles()
  const {history} = useReactRouter();

  // 右键菜单
  const menuInitState = {
    mouseX: null,
    mouseY: null,
    item: null
  };
  const [menuState, setMenuState] = useState(menuInitState);
  const db = getGlobalDB()

  useImperativeHandle(refs, () => ({
    // 父组件调用子组件方法
    handleRightClick: (event, item) => {
      event.preventDefault();
      setMenuState({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
        item
      });
    }
  }))

  const handleMenuItemClick = (type) => {
    setMenuState(menuInitState)
    const group = menuState.item._group
    switch (type) {
      case MENU_ACTION_ADD_GROUP:
        return handleAddGroup(group)
      case MENU_ACTION_ADD_ENTRY:
        return handleAddEntry(group)
      case MENU_ACTION_CHANGE_ICON:
        return handleChangeIcon(group).then(() => {
          setUpdater(v => !v)
        })
      case MENU_ACTION_RENAME:
        return handleEditGroup(group)
      case MENU_ACTION_MOVE:
        return handleMoveToGroup(group)
      case MENU_ACTION_DELETE:
        return handleDeleteGroup(group)
      default:
        return
    }
  };


  const handleAddGroup = (group) => {

    swal.fire({
      title: '添加群组',
      input: 'text',
      inputValue: '新群组',
      showCancelButton: true,
    }).then((result) => {
      if (!result.dismiss && result.value) {
        const newGroup = db.createGroup(group, result.value)
        setGroupListByDB(db)
        setDbHasUnsavedChange()
        setCurrentGroupUuid(newGroup.uuid)
      }
    })
  }

  const handleAddEntry = (group) => {
    const entry = db.createEntry(group)

    entry.fields.Title = formatDate(new Date())
    entry.icon = group.icon

    setCurrentGroupUuid(group.uuid)
    setCurrentEntry(entry)
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
          setGroupListByDB(db)
          setDbHasUnsavedChange()
          setCurrentGroupUuid(group.uuid)
        }
      });
  }

  const handleMoveToGroup = (group) => {
    confirmMoveToGroupChooser(db).then(selectedGroup => {
      db.move(group, selectedGroup);
      setGroupListByDB(db)
      setDbHasUnsavedChange()
      setCurrentGroupUuid(group.uuid)
    })
  }

  const handleDeleteGroup = (group) => {
    confirmDeleteGroup(group).then((result) => {
      db.remove(db.getGroup(group.uuid))
      setGroupListByDB(db)
      setDbHasUnsavedChange()
      setCurrentGroupUuid(null)
    });
  }


  return useMemo(() => {
    const item = menuState.item
    const menuList = [
      {
        icon: <AddCircleIcon fontSize="small"/>,
        title: '添加条目',
        action: MENU_ACTION_ADD_ENTRY
      },
      {
        icon: <AddBoxIcon fontSize="small"/>,
        title: '添加群组',
        action: MENU_ACTION_ADD_GROUP
      },
      {isDivider: true},
      {
        icon: <BorderColorIcon fontSize="small"/>,
        title: '重命名',
        action: MENU_ACTION_RENAME
      },
      {
        icon: <StarIcon/>,
        title: '修改图标',
        action: MENU_ACTION_CHANGE_ICON
      },
      {
        disabled: item && item.index === 0,
        icon: <DoubleArrowIcon fontSize="small"/>,
        title: '移动...',
        action: MENU_ACTION_MOVE
      },
      {
        disabled: item && item.index === 0,
        icon: <DeleteIcon fontSize="small"/>,
        title: item && getIsRecycleBin(item._group.uuid) ? '清空回收站' : '删除群组',
        action: MENU_ACTION_DELETE
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
                <ListItemIcon className={classes.menuIconWrap}>
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
})
