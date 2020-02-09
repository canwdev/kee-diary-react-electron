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
import {setCurrentEntry, setCurrentGroupUuid, setDbHasUnsavedChange} from "../../store/setters"
import {formatDate} from "../../utils"
import useReactRouter from "use-react-router"
import {confirmDeleteGroup, confirmMoveToGroupChooser, handleChangeIcon} from "../EntriesList/utils"
import StarIcon from "@material-ui/icons/Star"

const useStyles = makeStyles(theme => ({
  menuIconWrap,
}))


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
    const group = menuState.item._entry
    switch (type) {
      case 'addGroup':
        return handleAddGroup(group)
      case 'addEntry':
        return handleAddEntry(group)
      case 'changeIcon':
        return handleChangeIcon(group).then(() => {
          setUpdater(v => !v)
        })
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
          setDbHasUnsavedChange()
          setCurrentGroupUuid(group.uuid)
          setUpdater(v => !v)
        }
      });
  }

  const handleMoveToGroup = (group) => {
    confirmMoveToGroupChooser(db).then(selectedGroup => {
      db.move(group, selectedGroup);
      setDbHasUnsavedChange()
      setCurrentGroupUuid(group.uuid)
      setUpdater(v => !v)
    })
  }

  const handleDeleteGroup = (group) => {
    confirmDeleteGroup(group).then((result) => {
      db.remove(db.getGroup(group.uuid))
      setDbHasUnsavedChange()
      setCurrentGroupUuid(null)
      setUpdater(v => !v)
    });
  }


  return useMemo(() => {
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
        icon: <StarIcon/>,
        title: '修改图标',
        action: 'changeIcon'
      },
      {
        disabled: item && item.index === 0,
        icon: <DoubleArrowIcon fontSize="small"/>,
        title: '移动...',
        action: 'move'
      },
      {
        disabled: item && item.index === 0,
        icon: <DeleteIcon fontSize="small"/>,
        title: item && getIsRecycleBin(item._entry.uuid) ? '清空回收站' : '删除群组',
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
