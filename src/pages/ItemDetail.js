import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles"
import {Box, Container, Input, Paper, TextareaAutosize} from "@material-ui/core"
import clsx from "clsx"
import {formatDate} from "../utils"

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

  const [title, setTitle] = useState('')
  const [noteText, setNoteText] = useState('')
  const creationTime = formatDate(new Date())
  const lastModTime = formatDate(new Date())

  return (
    <Container maxWidth="md">
      <Paper className={classes.root}>

        <Box className={classes.box}>
          <Input
            placeholder="标题"
            defaultValue={title}
            onChange={setTitle}
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
            onChange={(e)=>{setNoteText(e.target.value)}}
            className={classes.NoteTextArea}
            rows={15}
            placeholder="开始写作..."
          />
        </Box>

      </Paper>
    </Container>
  )
}
