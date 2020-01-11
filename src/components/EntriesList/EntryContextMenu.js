import React, {forwardRef, useImperativeHandle, useMemo, useState} from 'react';
import {
  confirmDeleteEntry,
  confirmMoveToGroupChooser,
  handleChangeColor,
  handleChangeIcon, handleEnterEntry,
  showDetailWindow
} from "./utils"
import {setCurrentEntry, setCurrentGroupUuid, setDbHasUnsavedChange} from "../../store/setters"

import Menu from "@material-ui/core/Menu"
import Divider from "@material-ui/core/Divider"
import MenuItem from "@material-ui/core/MenuItem"
import Typography from "@material-ui/core/Typography"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import VisibilityIcon from "@material-ui/icons/Visibility"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from '@material-ui/icons/Delete';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import StarIcon from '@material-ui/icons/Star';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import {getGlobalDB} from "../../store/getters"
import {makeStyles} from "@material-ui/core"
import useReactRouter from "use-react-router"
import {menuIconWrap} from "../../assets/styles/commonStyles"

const useStyles = makeStyles(theme => ({
  menuIconWrap,
}))

export default forwardRef((props, refs) => {
  const {
    setUpdater = () => {
    }
  } = props
  const db = getGlobalDB()
  const classes = useStyles()
  const {history} = useReactRouter()

  useImperativeHandle(refs, () => ({
    // 父组件调用子组件方法
    handleRightClick: (event, entry) => {
      event.preventDefault();
      setMenuState({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
        entry
      });
    }
  }))

  // --- 右键菜单 ---
  const menuInitState = {
    mouseX: null,
    mouseY: null,
    entry: null
  };
  const [menuState, setMenuState] = useState(menuInitState);

  const handleMenuItemClick = (type) => {
    setMenuState(menuInitState)

    const entry = menuState.entry
    switch (type) {
      case 'preview':
        return showDetailWindow(entry)
      case 'edit':
        return handleEnterEntry(history, entry)
      case 'changeIcon':
        return handleChangeIcon(entry).then(() => {
          setUpdater(v => !v)
        })
      case 'changeColor':
        return handleChangeColor(entry).then(() => {
          setUpdater(v => !v)
        })
      case 'move':
        return handleMoveToGroup(entry)
      case 'delete':
        return handleDeleteEntry(entry)
      default:
        return
    }
  };

  // --- 操作 ---
  const handleDeleteEntry = (entry) => {
    confirmDeleteEntry(entry).then(() => {
      db.remove(entry);
      setDbHasUnsavedChange()
      setUpdater(v => !v)
    })
  }

  const handleMoveToGroup = (entry) => {
    confirmMoveToGroupChooser(db).then(selectedGroup => {
      db.move(entry, selectedGroup);
      setDbHasUnsavedChange()
      setCurrentGroupUuid(selectedGroup.uuid)
      setCurrentEntry(entry)
      setUpdater(v => !v)
    })
  }

  // --- 生成菜单VDOM ---
  return useMemo(() => {

    const menuList = [
      {
        icon: <VisibilityIcon/>,
        title: '预览',
        action: 'preview'
      },
      {
        icon: <EditIcon/>,
        title: '编辑',
        action: 'edit'
      },
      {isDivider: true},
      {
        // disabled: true,
        icon: <StarIcon/>,
        title: '修改图标',
        action: 'changeIcon'
      },
      {

        icon: <ColorLensIcon/>,
        title: '修改颜色',
        action: 'changeColor'
      },
      {
        icon: <DoubleArrowIcon/>,
        title: '移动...',
        action: 'move'
      },
      {
        icon: <DeleteIcon/>,
        title: '删除',
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

