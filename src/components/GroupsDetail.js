import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {useSelector} from "react-redux"
import {iconMap} from "../utils/icon-map"
import {getGlobalDB} from "../store/getters"

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  empty: {
    textAlign: 'center',
    padding: theme.spacing(10)
  }
}));

export default function SimpleTable() {
  const classes = useStyles();
  const uuid = useSelector(state => state.currentGroupUuid);
  const db = getGlobalDB()

  const entries = []
  if (db && uuid && uuid.id) {
    const group = db.getGroup(uuid)
    console.log('获取详情', group)

    group.entries.forEach((item, index) => {
      entries.push({
        uuid: item.uuid,
        icon: iconMap[item.icon],
        title: item.fields.Title,
        notes: item.fields.Notes,
        creationTime: item.times.creationTime,
        lastModTimelastModTime: item.times.lastModTime,
      })
    })
  }

  return (
    <Paper className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>图标</TableCell>
            <TableCell>标题</TableCell>
            <TableCell>内容</TableCell>
            <TableCell>创建日期</TableCell>
            <TableCell align="right">修改日期</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map(row => (
            <TableRow key={row.uuid.id}>
              <TableCell><i style={{fontSize: 20}} className={`fa fa-${row.icon}`}/></TableCell>
              <TableCell component="th" scope="row">
                {row.title}
              </TableCell>
              <TableCell>{row.notes}</TableCell>
              <TableCell>{row.creationTime.toString()}</TableCell>
              <TableCell align="right">{row.creationTime.toString()}</TableCell>
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
