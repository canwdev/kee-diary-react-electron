import React, {useState} from 'react';
import {Redirect} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles"
import {Box, Container, Input, Paper, TextareaAutosize} from "@material-ui/core"
import clsx from "clsx"
import {formatDate, pad2Num} from "../utils"
import {useSelector} from "react-redux"
import {selectorCurrentEntry} from "../store/getters"
import {setDbHasUnsavedChange} from "../store/setters"
import swal from "sweetalert2"
import ReactDOM from "react-dom"

const fontFamily = `"Open Sans", "Source Han Sans SC", "PingFang SC", Arial, "Microsoft YaHei", "Helvetica Neue", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif`
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
    fontFamily
  },
  box: {
    margin: theme.spacing(2),
  },
  titleInput: {
    width: '100%',
    fontSize: theme.typography.h6.fontSize,
    fontFamily
  },
  timeWrap: {
    display: 'flex',
    justifyContent: 'space-between',
    color: theme.palette.grey["400"]
  },
  time: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  NoteTextArea: {
    width: '100%',
    fontSize: theme.typography.body1.fontSize,
    fontFamily,
    border: 'none',
    outline: 'none',
    lineHeight: 1.5,
  }

}))

export default function () {
  const classes = useStyles()
  const unlocked = useSelector(state => state.unlocked);

  let entry = useSelector(selectorCurrentEntry) || {
    fields: {
      Title: '没有打开的条目',
      Notes: '你的修改不会被保存',
    },
    times: {
      creationTime: new Date(),
      lastModTime: new Date()
    }
  }
  const [updater, setUpdater] = useState(false)
  const [title, setTitle] = useState(entry.fields.Title)
  const [noteText, setNoteText] = useState(entry.fields.Notes)
  const creationTime = formatDate(entry.times.creationTime)
  const lastModTime = formatDate(entry.times.lastModTime)

  function updateEntry() {
    // TODO: 潜在的性能问题
    entry.times.lastModTime = new Date()
    setDbHasUnsavedChange()
  }

  function handleTitleChange(e) {
    const value = e.target.value

    entry.fields.Title = value
    updateEntry()
    setTitle(value)
  }

  /**
   * 手动更新时间
   * @param timeType
   */
  function handleTimeChange(timeType = 'creationTime') {
    let now = entry.times[timeType] || new Date()
    let date = now.toISOString().substr(0, 10)
      , time = pad2Num(now.getHours()) + ':' + pad2Num(now.getMinutes())
    // console.log(entry.times, {date, time})

    swal.fire({
      title: '修改时间',
      html: ReactDOM.render((
        <div>
          <input type="date" defaultValue={date} onChange={(e) => {
            date = e.target.value
          }}/>
          <input type="time" defaultValue={time} onChange={(e) => {
            time = e.target.value
          }}/>
        </div>
      ), document.createElement('div')),
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        return {date, time}
      }
    }).then(res => {
      if (!res.dismiss && res.value) {
        entry.times[timeType] = new Date(res.value.date + ' ' + res.value.time)
        setDbHasUnsavedChange()
        setUpdater(v => !v)
      }
    })
  }

  function handleNoteTextChange(e) {
    const value = e.target.value

    entry.fields.Notes = value
    updateEntry()
    setNoteText(value)
  }

  return (
    <Container maxWidth="md">
      {!unlocked ? <Redirect to="/"/> : null}
      <Paper className={classes.root}>

        <Box className={classes.box}>
          <Input
            placeholder="标题"
            value={title}
            onChange={handleTitleChange}
            className={classes.titleInput}
          />
        </Box>

        <Box className={clsx(classes.box, classes.timeWrap)}>
          <div>创建时间：<span
            className={classes.time}
            onClick={() => {
              handleTimeChange('creationTime')
            }}
          >{creationTime}</span></div>
          <div>最近修改：<span
            className={classes.time}
            onClick={() => {
              handleTimeChange('lastModTime')
            }}
          >{lastModTime}</span></div>
        </Box>

        <Box className={classes.box}>
          <TextareaAutosize
            value={noteText}
            onChange={handleNoteTextChange}
            className={classes.NoteTextArea}
            rows={15}
            placeholder="开始写作..."
          />
        </Box>

      </Paper>
    </Container>
  )
}
