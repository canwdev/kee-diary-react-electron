import React, {useState} from 'react';
import {Redirect} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles"
import {Box, Container, Input, Paper, TextareaAutosize} from "@material-ui/core"
import clsx from "clsx"
import {formatDate} from "../utils"
import {useSelector} from "react-redux"
import {selectorCurrentEntry} from "../store/getters"
import {setDbHasUnsavedChange} from "../store/setters"

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
  time: {
    display: 'flex',
    justifyContent: 'space-between',
    color: theme.palette.grey["400"]
  },
  NoteTextArea: {
    width: '100%',
    fontSize: theme.typography.body1.fontSize,
    fontFamily,
    border: 'none',
    outline: 'none'
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

        <Box className={clsx(classes.box, classes.time)}>
          <div>创建时间：{creationTime}</div>
          <div>最近修改：{lastModTime}</div>
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
