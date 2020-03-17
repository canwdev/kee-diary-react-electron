import React, {useEffect, useMemo, useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
// import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {setCurrentGroupUuid} from "../../store/setters"
import {selectorCurrentGroupUuid, selectorGroupList, selectorIsDarkMode} from "../../store/getters"
import {useSelector} from "react-redux"
// import StarBorder from '@material-ui/icons/StarBorder';
import GroupListContextMenu from "./GroupListContextMenu"
import {menuIconWrap} from "../../assets/styles/commonStyles"

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(2),
  },
  iconWrap: menuIconWrap,
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

export default function GroupList() {
  const classes = useStyles();
  const isDarkMode = useSelector(selectorIsDarkMode)

  const currentGroupUuid = useSelector(selectorCurrentGroupUuid)
  const groupList = useSelector(selectorGroupList)

  // 右键菜单
  const contextMenuRef = useRef();
  const handleRightClick = (event, item) => {

    event.preventDefault();
    contextMenuRef.current.handleRightClick(event, item)

  };

  useEffect(() => {
    if (!currentGroupUuid && groupList && groupList[0]) { // 自动选择第一个群组
      setCurrentGroupUuid(groupList[0].uuid)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleItemClick = (item) => {
    // console.log('点击群组项', item)
    setCurrentGroupUuid(item.uuid)
  }


  /**
   * 生成Group列表 VDOM（递归生成）
   * @param list 传 groupsFiltered
   */
  const generateGroupListVDOM = (list) => {
    const VDOM = []
    if (!list || list.length === 0) return null

    list.forEach(item => {
      const children = item.children

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
            {children.length !== 0 && <ExpandMoreIcon/>}
          </ListItem>
          <Collapse in={true} >
            {generateGroupListVDOM(children)}
          </Collapse>
        </List>
      )
    })

    return VDOM
  }

  const GroupListVDOM = useMemo(() => {
    return generateGroupListVDOM(groupList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGroupUuid, isDarkMode, groupList])

  return (
    <>
      <List
        component="nav"
        className={classes.root}
      >
        {GroupListVDOM}
      </List>
      <GroupListContextMenu
        ref={contextMenuRef}
      />
    </>
  );
}
