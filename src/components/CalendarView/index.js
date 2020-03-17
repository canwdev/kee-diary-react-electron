import React, {useRef, useState} from "react"
import {Paper} from "@material-ui/core"
import {makeStyles} from "@material-ui/core/styles"
import {getGlobalDB, selectorCurrentGroupUuid} from "../../store/getters"
import {useSelector} from "react-redux"
import Calendar from './Calendar'
import EntryContextMenu from "../EntriesList/EntryContextMenu"

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: '100%',
    height: 'calc(95vh - 60px)',
    minHeight: '200px',
    overflow: 'auto',
  }
}))

export default function () {
  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const [updater, setUpdater] = useState(false)

  // 右键菜单
  const contextMenuRef = useRef();
  const handleRightClick = (event, entry) => {
    contextMenuRef.current.handleRightClick(event, entry)
  }

  // 日历数据
  const db = getGlobalDB()
  const groupUuid = useSelector(selectorCurrentGroupUuid);
  const data = {}
  if (db && groupUuid && groupUuid.id) {
    const group = db.getGroup(groupUuid)

    let creationTime, year, month, day;
    // Recursive traverse，will be called for each entry or group
    // TODO: 需要性能优化，缓存到 store
    group.forEach((entry, group) => {
      if (entry) {
        creationTime = entry.times.creationTime
        year = creationTime.getFullYear()
        month = creationTime.getMonth() + 1
        day = creationTime.getDate()

        // 初始化
        if (!data[year]) data[year] = {}
        if (!data[year][month]) data[year][month] = {}
        if (!data[year][month][day]) data[year][month][day] = []

        data[year][month][day].push(entry)
      }
    });
  }

  return (
    <Paper className={classes.root}>
      <Calendar
        calendarData={data}
        onEntryItemRightClick={handleRightClick}
      />

      <EntryContextMenu
        ref={contextMenuRef}
        setUpdater={setUpdater}
      />
    </Paper>
  )
}
