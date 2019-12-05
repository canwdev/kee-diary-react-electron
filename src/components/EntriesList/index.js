import React, {useEffect, useMemo, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {useSelector} from "react-redux"
import {iconMap} from "../../utils/icon-map"
import {getGlobalDB, selectorCurrentEntry, selectorCurrentGroupUuid} from "../../store/getters"
import useReactRouter from "use-react-router"
import {setCurrentEntry, setCurrentGroupUuid, setDbHasUnsavedChange} from "../../store/setters"
import Menu from "@material-ui/core/Menu"
import Divider from "@material-ui/core/Divider"
import MenuItem from "@material-ui/core/MenuItem"
import Typography from "@material-ui/core/Typography"

import ListItemIcon from "@material-ui/core/ListItemIcon"
import DeleteIcon from '@material-ui/icons/Delete';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import {EnhancedTableToolbar} from "./EnhancedTableToolbar"
import {confirmDeleteEntry, confirmMoveToGroupChooser} from "./utils"
import ListItem from "./ListItem"
import TablePagination from "@material-ui/core/TablePagination"

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: '100%',
    height: 'calc(95vh - 60px)',
    minHeight: '300px',
    overflow: 'auto',
  },
  tableHeadCell: {
    fontWeight: 'bold',
  },
  tableRow: {
    "&:hover": {
      backgroundColor: theme.palette.grey["300"]
    }
  },
  tableCell: {
    cursor: 'pointer'
  },
  checkboxWrap: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    fontSize: 20,
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuIconWrap: {
    minWidth: '32px',
    fontSize: '18px'
  },
  empty: {
    textAlign: 'center',
    padding: theme.spacing(10)
  },
  pagination: {
    userSelect: 'none',
    position: 'sticky',
    background: theme.palette.background.default,
    bottom: -1,
    borderTop: '1px solid ' + theme.palette.grey[300]
  }
}));

export default function () {
  const db = getGlobalDB()
  const [updater, setUpdater] = useState(false)
  const [checked, setChecked] = useState([]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const groupUuid = useSelector(selectorCurrentGroupUuid);
  let currentEntry = useSelector(selectorCurrentEntry) || {
    uuid: {
      id: null
    }
  }

  useEffect(() => {
    setChecked([]) // 如果切换了群组则清空选择列表
    setPage(0)
  }, [groupUuid])

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
    confirmDeleteEntry(entry).then(() => {
      db.remove(entry);
      setDbHasUnsavedChange()
      setUpdater(v => !v)
    })
  }

  function handleMoveToGroup(entry) {
    confirmMoveToGroupChooser(db).then(selectedGroup => {
      db.move(entry, selectedGroup);
      setDbHasUnsavedChange()
      setCurrentGroupUuid(selectedGroup.uuid)
      setCurrentEntry(entry)
      setUpdater(v => !v)
    })
  }

  function handleCheckEntry(item) {
    const selectedIndex = checked.indexOf(item)
    let newChecked = []

    if (selectedIndex === -1) {
      newChecked = [...checked, item]
    } else {
      newChecked = checked.filter(i => i !== item)
    }

    setChecked(newChecked)
  }

  function handleEntryItemClick(item) {
    setCurrentEntry(item._ref)
    history.push('/item-detail')
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const generatedMenu = useMemo(() => {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuState])

  const entries = useMemo(() => {
    // console.log('generate entries')
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
            bgColor: item.bgColor,
            fgColor: item.fgColor,
            creationTime: item.times.creationTime,
            lastModTime: item.times.lastModTime,
            _ref: item
          })
        }
      }

    }
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updater, groupUuid]);

  const TableRows = useMemo(() => {
    // console.log('generateTable')
    return entries
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((row, index) => {
          const rowChecked = checked.indexOf(row) !== -1
          return (
            <ListItem
              key={index}
              row={row}
              currentEntry={currentEntry}
              classes={classes}
              rowChecked={rowChecked}
              handleRightClick={handleRightClick}
              handleCheckEntry={handleCheckEntry}
              handleEntryItemClick={handleEntryItemClick}
              setUpdater={setUpdater}
            />
          )
        }
      )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updater, groupUuid, checked, page, rowsPerPage])

  return (
    <Paper className={classes.root}>
      <div>
        <EnhancedTableToolbar
          db={db}
          checked={checked}
          setChecked={setChecked}
          setUpdater={setUpdater}
        />
        <Table
          className={classes.table}
          // size="small"
          // stickyHeader
        >
          <TableHead>
            <TableRow>
              <TableCell style={{width: '80px'}}/>
              <TableCell className={classes.tableHeadCell}>标题</TableCell>
              <TableCell className={classes.tableHeadCell}>创建时间</TableCell>
              <TableCell className={classes.tableHeadCell} align="left">修改时间</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {TableRows}
          </TableBody>

        </Table>

      </div>
      <TablePagination
        className={classes.pagination}
        rowsPerPageOptions={[5, 10, 20, 30]}
        component="div"
        count={entries.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': '上一页',
        }}
        nextIconButtonProps={{
          'aria-label': '下一页',
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />

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
