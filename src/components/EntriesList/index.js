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
import StarIcon from '@material-ui/icons/Star';
import ColorLensIcon from '@material-ui/icons/ColorLens';
import {EnhancedTableToolbar} from "./EnhancedTableToolbar"
import {confirmDeleteEntry, confirmMoveToGroupChooser, handleChangeColor, handleChangeIcon} from "./utils"
import ListItem from "./ListItem"
import TablePagination from "@material-ui/core/TablePagination"
import {localStorageUtil} from "../../utils"
import TableSortLabel from "@material-ui/core/TableSortLabel"

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: '100%',
    height: 'calc(95vh - 60px)',
    minHeight: '200px',
    overflow: 'auto',
  },
  tableHeadCell: {
    fontWeight: 'bold',
  },
  tableRow: {
    "&:hover": {
      backgroundColor: theme.palette.grey[300]
    }
  },
  tableCell: {
    cursor: 'pointer'
  },
  tableHeadCellActions: {
    minWidth: '140px'
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
  },

  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

// --- 排序方法 ---
function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const headCells = [
  {id: 'title', width: 'auto', label: '标题'},
  {id: 'creationTime', width: '20%', label: '创建时间'},
  {id: 'lastModTime', width: '20%', label: '修改时间'}
]
const FLAG_SORT_ORDER = 'SETTINGS_SORT_ORDER'
const FLAG_SORT_ORDER_BY = 'SETTINGS_SORT_BY'

export default function () {
  const db = getGlobalDB()
  const [updater, setUpdater] = useState(false)
  const [checked, setChecked] = useState([]);

  // --- 排序 ---
  const initSortOrder = localStorageUtil.getItem(FLAG_SORT_ORDER) || 'desc'
  const [order, setOrder] = React.useState(initSortOrder);
  const initSortBy = localStorageUtil.getItem(FLAG_SORT_ORDER_BY) || 'creationTime'
  const [orderBy, setOrderBy] = React.useState(initSortBy);

  // --- 分页 ---
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // --- 数据 ---
  const groupUuid = useSelector(selectorCurrentGroupUuid);
  const FLAG_PAGE = 'PAGE_' + groupUuid
  let currentEntry = useSelector(selectorCurrentEntry) || {
    uuid: {
      id: null
    }
  }

  useEffect(() => {
    setChecked([]) // 如果切换了群组则清空选择列表
    const page = localStorageUtil.getItem(FLAG_PAGE) || 0
    setPage(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupUuid])

  const {history} = useReactRouter();
  const classes = useStyles();

  // --- 右键菜单 ---
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

  const handleDeleteEntry = (entry) => {
    confirmDeleteEntry(entry).then(() => {
      db.remove(entry);
      setDbHasUnsavedChange()
      setUpdater(v => !v)
    })
  }

  // --- 操作 ---
  const handleMoveToGroup = (entry) => {
    confirmMoveToGroupChooser(db).then(selectedGroup => {
      db.move(entry, selectedGroup);
      setDbHasUnsavedChange()
      setCurrentGroupUuid(selectedGroup.uuid)
      setCurrentEntry(entry)
      setUpdater(v => !v)
    })
  }
  const handleCheckEntry = (item) => {
    const selectedIndex = checked.indexOf(item)
    let newChecked = []

    if (selectedIndex === -1) {
      newChecked = [...checked, item]
    } else {
      newChecked = checked.filter(i => i !== item)
    }

    setChecked(newChecked)
  }
  const handleEntryItemClick = (item) => {
    setCurrentEntry(item._ref)
    history.push('/item-detail')
  }
  const handleChangePage = (event, newPage) => {
    localStorageUtil.setItem(FLAG_PAGE, newPage)
    setPage(newPage);
  };
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // --- 排序操作 ---
  const createSortHandler = property => event => {
    handleRequestSort(event, property);
  }
  const handleRequestSort = (event, property) => {
    const isDesc = (orderBy === property && order === 'desc') ? 'asc' : 'desc';

    setOrder(isDesc);
    setOrderBy(property);
    localStorageUtil.setItem(FLAG_SORT_ORDER, isDesc)
    localStorageUtil.setItem(FLAG_SORT_ORDER_BY, property)
  }

  // --- 生成菜单VDOM ---
  const generatedMenu = useMemo(() => {
    if (menuState.item) {
      const menuList = [
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuState])

  // --- 生成数据 ---
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
  }, [updater, groupUuid])

  // --- 生成列表 ---
  const TableRows = useMemo(() => {
    // console.log('generateTable')
    return stableSort(entries, getSorting(order, orderBy))
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
  }, [updater, groupUuid, checked, page, rowsPerPage, order, orderBy])

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

              <TableCell align="center" className={classes.tableHeadCellActions}>★</TableCell>

              {headCells.map(headCell => (
                <TableCell
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                  className={classes.tableHeadCell}
                  style={{width: headCell.width}}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={order}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {TableRows}
          </TableBody>

        </Table>

      </div>
      <TablePagination
        className={classes.pagination}
        rowsPerPageOptions={[5, 10, 15, 20, 30]}
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
