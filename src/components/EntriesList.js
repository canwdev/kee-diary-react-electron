import React, {useMemo, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {useSelector} from "react-redux"
import {iconMap} from "../utils/icon-map"
import {getGlobalDB, getIsRecycleBinEnabled, selectorCurrentEntry, selectorCurrentGroupUuid} from "../store/getters"
import {deepWalkGroup, formatDate} from "../utils"
import useReactRouter from "use-react-router"
import {setCurrentEntry, setCurrentGroupUuid, setDbHasUnsavedChange} from "../store/setters"
import Menu from "@material-ui/core/Menu"
import Divider from "@material-ui/core/Divider"
import MenuItem from "@material-ui/core/MenuItem"
import Typography from "@material-ui/core/Typography"

import ListItemIcon from "@material-ui/core/ListItemIcon"
import DeleteIcon from '@material-ui/icons/Delete';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import swal from "sweetalert2"
import ReactDOM from "react-dom"

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  tableRow: {
    cursor: 'pointer',
    "&:hover": {
      backgroundColor: theme.palette.grey["300"]
    }
  },
  iconWrap: {
    minWidth: '32px',
    fontSize: '18px'
  },
  empty: {
    textAlign: 'center',
    padding: theme.spacing(10)
  },

  nested: {
    paddingLeft: theme.spacing(2),
  },
  targetGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    lineHeight: '30px',
    "&:hover": {
      backgroundColor: theme.palette.grey["300"]
    }
  },
}));

export default function (props) {
  const [on, setOn] = useState(false)

  const {history} = useReactRouter();
  const classes = useStyles();

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

    const entry = menuState.item._ref
    switch (type) {
      case 'move':
        return handleMoveToGroup(entry)
      case 'delete':
        return handleDeleteEntry(entry)
      default:
        return
    }
  };

  function handleDeleteEntry(entry) {
    const title = entry.fields.Title
    swal.fire({
      title: '确认删除',
      text: getIsRecycleBinEnabled() ? `确定要将《${title}》移动至回收站吗？` : `确定要永久删除《${title}》吗？`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.value) {
        db.remove(entry);
        setDbHasUnsavedChange()
        setOn(!on)
      }
    });
  }

  function handleMoveToGroup(entry) {
    let selectedGroup = null

    function generateGroupSelector(list, counter = 0) {
      const VDOM = []
      if (!list || list.length === 0) return null

      list.forEach(item => {
        const children = item.children
        VDOM.push(
          <div
            key={item.uuid}
            className={classes.nested}
          >
            <label className={classes.targetGroup}>
              <input
                type="radio"
                name="target-group"
                disabled={entry.uuid.id === item._ref.uuid.id}
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
          {generateGroupSelector(deepWalkGroup(db.groups))}
        </div>
      ), document.createElement('div')),
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        return selectedGroup
      }
    }).then(res => {
      if (!res.dismiss && res.value) {
        db.move(entry, selectedGroup);
        setDbHasUnsavedChange()
        setCurrentGroupUuid(selectedGroup.uuid)
        setCurrentEntry(entry)
        setOn(!on)
      }
    })
  }

  const generatedMenu = useMemo(()=>{
    if (menuState.item) {
      const menuList = [
        {
          disabled: menuState.item.index === 0,
          icon: <DoubleArrowIcon fontSize="small"/>,
          title: '移动至群组',
          action: 'move'
        },
        {
          disabled: menuState.item.index === 0,
          icon: <DeleteIcon fontSize="small"/>,
          title: '删除条目',
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
    }
  }, [menuState])

  const groupUuid = useSelector(selectorCurrentGroupUuid);
  let currentEntry = useSelector(selectorCurrentEntry) || {
    uuid: {
      id: null
    }
  }

  const db = getGlobalDB()
  const entries = useMemo(() => {
    console.log('generate entries')
    const list = []
    if (db && groupUuid && groupUuid.id) {
      const group = db.getGroup(groupUuid)
      // console.log('获取详情', group)

      if (group) {
        for (let i = group.entries.length - 1; i >= 0; i--) {
          let item = group.entries[i]
          list.push({
            uuid: item.uuid,
            icon: iconMap[item.icon],
            title: item.fields.Title,
            url: item.fields.URL,
            creationTime: item.times.creationTime,
            lastModTime: item.times.lastModTime,
            _ref: item
          })
        }
      }

    }
    return list
  }, [on, groupUuid]);

  const generatedTable = useMemo(() => {
    console.log('generateTable')
    return (
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{width: '32px'}}/>
            <TableCell>标题</TableCell>
            <TableCell>创建时间</TableCell>
            <TableCell align="left">修改时间</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {entries.map(row => (
            <TableRow
              selected={currentEntry.uuid.id === row.uuid.id}
              key={row.uuid.id}
              className={classes.tableRow}
              onClick={() => {
                handleEntryItemClick(row)
              }}
              onContextMenu={(event) => {
                handleRightClick(event, row)
              }}
            >
              <TableCell><i style={{fontSize: 20}} className={`fa fa-${row.icon}`}/></TableCell>
              <TableCell component="th" scope="row">
                {row.title}
              </TableCell>
              <TableCell>{formatDate(row.creationTime)}</TableCell>
              <TableCell align="left">{formatDate(row.lastModTime)}</TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>
    )

  }, [on, groupUuid])

  function handleEntryItemClick(item) {
    setCurrentEntry(item._ref)
    history.push('/item-detail')
  }

  return (
    <Paper className={classes.root}>
      {
        generatedTable
      }

      {
        entries.length === 0 && (
          <div className={classes.empty}>没有条目</div>
        )
      }

      {
        generatedMenu
      }
    </Paper>
  );
}
