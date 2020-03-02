import React, {useEffect, useRef, useState, memo} from 'react';
import PropTypes from 'prop-types'
import {Redirect} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles"
import {Box, Container, Input, Paper, TextareaAutosize} from "@material-ui/core"
import clsx from "clsx"
import {formatDate, isValidDate, pad2Num} from "../utils"
import {useSelector} from "react-redux"
import {selectorCurrentEntry} from "../store/getters"
import {setDbHasUnsavedChange} from "../store/setters"
import swal from "sweetalert2"
import ReactDOM from "react-dom"
import useReactRouter from "use-react-router"
import {showDetailWindow} from "../utils/actions"
import {fontFamily} from "../assets/styles/commonStyles"
import EntryIcon from "../components/EntryIcon"
import EntryContextMenu from "../components/EntriesList/EntryContextMenu"

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
    fontFamily,
    marginBottom: '100px'
  },
  box: {
    margin: theme.spacing(2),
  },
  inputWrap: {
    display: 'flex',
  },
  titleInput: {
    width: '100%',
    fontSize: theme.typography.h6.fontSize,
    fontFamily
  },
  action: {
    marginRight: '5px'
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
    background: theme.palette.background.paper,
    color: theme.palette.text.primary
  }

}))

const EditorTitle = memo(function EditorTitle(props) {
  const {
    entry,
    title,
    handleTitleChange,
    handleRightClick
  } = props
  const classes = useStyles()

  return (
    <Box
      className={clsx(classes.box, classes.inputWrap)}
      onContextMenu={(event) => {
        handleRightClick(event)
      }}
    >
      <div className={classes.action}>
        <EntryIcon
          entry={entry}
          title={"预览 (Ctrl+/)"}
        />
      </div>
      <Input
        placeholder="标题"
        value={title}
        onChange={handleTitleChange}
        className={classes.titleInput}
      />
    </Box>
  )
})
EditorTitle.propTypes = {
  entry: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  handleRightClick: PropTypes.func.isRequired,
}

const EditorTime = memo(function EditorTime(props) {
  const {
    entry,
    handleTimeChange
  } = props
  const classes = useStyles()

  return (
    <Box className={clsx(classes.box, classes.timeWrap)}>
      <div>创建时间：<span
        className={classes.time}
        onClick={() => {
          handleTimeChange('creationTime')
        }}
      >{formatDate(entry.times.creationTime)}</span></div>
      <div>修改时间：<span
        className={classes.time}
        onClick={() => {
          handleTimeChange('lastModTime')
        }}
      >{formatDate(entry.times.lastModTime)}</span></div>
    </Box>
  )
})
EditorTime.propTypes = {
  entry: PropTypes.object.isRequired,
  handleTimeChange: PropTypes.func.isRequired,
}

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
  // eslint-disable-next-line no-unused-vars
  const [updater, setUpdater] = useState(false)
  const [title, setTitle] = useState(entry.fields.Title)
  const [noteText, setNoteText] = useState(entry.fields.Notes)
  const {history} = useReactRouter();

  // 确保内容是新的
  useEffect(() => {
    setTitle(entry.fields.Title)
    setNoteText(entry.fields.Notes)
  }, [entry.fields.Title, entry.fields.Notes])

  // 右键菜单
  const contextMenuRef = useRef();
  const handleRightClick = (event) => {
    contextMenuRef.current.handleRightClick(event, entry)
  }


  useEffect(() => {
    // 快捷键
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        history.push('/view-list')
      }
      if (event.ctrlKey || event.metaKey) {
        switch (String.fromCharCode(event.which).toLowerCase()) {
          case '¿': // 符号："/"
            event.preventDefault()
            showDetailWindow(entry)
            break;
          default:
            return
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateEntry = () => {
    // 潜在的性能问题
    entry.times.lastModTime = new Date()
    setDbHasUnsavedChange()
  }

  /**
   * 手动更新时间
   * @param timeType
   */
  const handleTimeChange = (timeType = 'creationTime') => {
    let d = entry.times[timeType] || new Date()
    let date = `${d.getFullYear()}-${pad2Num(d.getMonth() + 1)}-${pad2Num(d.getDate())}`
      , time = `${pad2Num(d.getHours())}:${pad2Num(d.getMinutes())}`
    // console.log(entry.times, {date, time})

    swal.fire({
      title: `修改 ${timeType}`,
      html: ReactDOM.render((
        <div>
          <label htmlFor="setDate">
            {'日期 '}
            <input
              id="setDate"
              type="date"
              defaultValue={date}
              onChange={(e) => {
                date = e.target.value
              }}/>
          </label>
          <label htmlFor="setTime">
            {' 时间 '}
            <input
              id="setTime"
              type="time"
              defaultValue={time}
              onChange={(e) => {
                time = e.target.value
              }}/>
          </label>
        </div>
      ), document.createElement('div')),
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        return {date, time}
      }
    }).then(res => {
      if (!res.dismiss && res.value) {
        const date = new Date(res.value.date + ' ' + res.value.time)

        if (!isValidDate(date)) {
          swal.fire({icon: 'error', title: '日期时间格式错误'})
          return
        }

        entry.times[timeType] = date
        setDbHasUnsavedChange()
        setUpdater(v => !v)
      }
    })
  }

  const handleTitleChange = (e) => {
    entry.fields.Title = e.target.value
    updateEntry()
    setTitle(e.target.value)
  }

  const handleNoteTextChange = (e) => {
    entry.fields.Notes = e.target.value
    updateEntry()
    setNoteText(e.target.value)
  }

  return (
    <Container maxWidth="md">
      {!unlocked ? <Redirect to="/"/> : null}
      <Paper className={classes.root}>

        <EditorTitle
          entry={entry}
          title={title}
          handleTitleChange={handleTitleChange}
          handleRightClick={handleRightClick}
        />

        <EditorTime
          entry={entry}
          handleTimeChange={handleTimeChange}
        />

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

      <EntryContextMenu
        ref={contextMenuRef}
        setUpdater={setUpdater}
        disableEdit={true}
      />
    </Container>
  )
}
