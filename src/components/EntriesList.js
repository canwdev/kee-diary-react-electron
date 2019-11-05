import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {useSelector} from "react-redux"
import {iconMap} from "../utils/icon-map"
import {selectorCurrentGroupUuid, getGlobalDB} from "../store/getters"
import {formatDate} from "../utils"
import useReactRouter from "use-react-router"
import {setCurrentEntry} from "../store/setters"

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
  empty: {
    textAlign: 'center',
    padding: theme.spacing(10)
  }
}));

export default function (props) {
  const classes = useStyles();

  const {history} = useReactRouter();
  const uuid = useSelector(selectorCurrentGroupUuid);
  const db = getGlobalDB()

  const entries = []
  if (db && uuid && uuid.id) {
    const group = db.getGroup(uuid)
    // console.log('获取详情', group)

    group && group.entries.forEach((item, index) => {
      entries.push({
        uuid: item.uuid,
        icon: iconMap[item.icon],
        title: item.fields.Title,
        url: item.fields.URL,
        creationTime: item.times.creationTime,
        lastModTime: item.times.lastModTime,
        _ref: item
      })
    })
  }

  function handleEntryItemClick(item) {
    setCurrentEntry(item)
    history.push('/item-detail')
  }

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>图标</TableCell>
            <TableCell>标题</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>创建时间</TableCell>
            <TableCell align="left">修改时间</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map(row => (
            <TableRow
              key={row.uuid.id}
              className={classes.tableRow}
              onClick={() => {
                handleEntryItemClick(row)
              }}
            >
              <TableCell><i style={{fontSize: 20}} className={`fa fa-${row.icon}`}/></TableCell>
              <TableCell component="th" scope="row">
                {row.title}
              </TableCell>
              <TableCell>{row.url}</TableCell>
              <TableCell>{formatDate(row.creationTime)}</TableCell>
              <TableCell align="left">{formatDate(row.lastModTime)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {
        entries.length === 0 && (
          <div className={classes.empty}>没有条目</div>
        )
      }
    </Paper>
  );
}
