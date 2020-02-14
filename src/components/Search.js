import React, {useEffect, useMemo, useRef, useState} from "react"
import Typography from '@material-ui/core/Typography';
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import IconButton from "@material-ui/core/IconButton"
import CloseIcon from '@material-ui/icons/Close';
import {makeStyles} from "@material-ui/core/styles"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import TextField from "@material-ui/core/TextField"
import {getGlobalDB, selectorCurrentGroupUuid, selectorUnlocked} from "../store/getters"
import {useSelector} from "react-redux"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemText from "@material-ui/core/ListItemText"
import EntryIcon from "./EntryIcon"
import {showDetailWindow} from "../utils/actions"
import EntryContextMenu, {MENU_ACTION_PREVIEW} from "./EntriesList/EntryContextMenu"
import Switch from "@material-ui/core/Switch"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Divider from "@material-ui/core/Divider"
import clsx from "clsx"

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    marginBottom: theme.spacing(1),
    width: '100%',
  },
  submitFormControl: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  submitButton: {
    width: '100px',
  },
  hidden: {
    display: 'none'
  },
  empty: {
    textAlign: 'center',
    padding: '10px'
  }
}))

const generateGroupList = (groups, result = [], deep = -1) => {
  if (!groups || groups.length === 0) return null
  deep++

  groups.forEach(group => {
    result.push({
      name: '➡'.repeat(deep) + ' ' + group.name, // 全角空格“　”
      uuid: group.uuid,
      deep
    })

    generateGroupList(group.groups, result, deep)
  })

  return result
}

const generateEntriesList = (group, flagSearchDeep) => {
  const result = []
  const walkGroups = (groups) => {
    if (!groups || groups.length === 0) return null

    groups.forEach(group => {
      group.entries.forEach(entry => {
        result.push(entry)
      })
      walkGroups(group.groups)
    })

  }

  group.entries.forEach(entry => {
    result.push(entry)
  })

  if (flagSearchDeep) {
    walkGroups(group.groups)
  }

  return result

}

function SearchListItem(props) {
  const {
    entry,
    handleRightClick
  } = props

  return (
    <ListItem
      button
      onClick={() => {
        showDetailWindow(entry)
      }}
      onContextMenu={(event) => {
        handleRightClick(event, entry)
      }}
    >
      <ListItemAvatar>
        <EntryIcon entry={entry} small={true} disabled={true}/>
      </ListItemAvatar>
      <ListItemText primary={entry.fields.Title}/>
    </ListItem>
  )
}

export default function Search(props) {
  const classes = useStyles();
  const [searchText, setSearchText] = useState('')
  const [searchGroupUuid, setSearchGroupUuid] = useState('')
  const [flagSearchDeep, setFlagSearchDeep] = useState(true)
  const [resultList, setResultList] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [updater, setUpdater] = useState(false) // 用于强制刷新组件状态
  const currentGroupUuid = useSelector(selectorCurrentGroupUuid)
  const unlocked = useSelector(selectorUnlocked)

  // 右键菜单
  const contextMenuRef = useRef();
  const handleRightClick = (event, entry) => {
    contextMenuRef.current.handleRightClick(event, entry)
  }

  const {open, handleClose} = props
  const db = getGlobalDB()

  const groupList = useMemo(() => {
    return db && generateGroupList(db.groups)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, currentGroupUuid])

  useEffect(() => {
    const uuidObj = db && currentGroupUuid && db.getGroup(currentGroupUuid)
    if (uuidObj && uuidObj.uuid) {
      setSearchGroupUuid(uuidObj.uuid)
    } else {
      groupList && setSearchGroupUuid(groupList[0].uuid)
    }
  }, [db, groupList, currentGroupUuid])

  const handleSearch = (event) => {
    event.preventDefault()

    const group = db && db.getGroup(searchGroupUuid)

    const allEntries = generateEntriesList(group, flagSearchDeep)
    const filteredEntries = allEntries.filter(entry => {
      return entry.fields.Title.indexOf(searchText) !== -1 ||
        entry.fields.Notes.indexOf(searchText) !== -1;

    })

    // console.log(filteredEntries)
    setResultList(filteredEntries)
  }

  const clearSearch = () => {
    setSearchText('')
    setResultList([])
  }
  useEffect(() => {
    if (!unlocked) {
      clearSearch()
    }
  }, [unlocked])

  return (
    <Dialog
      fullWidth={true}
      maxWidth='xs'
      open={open}
      onClose={handleClose}
    >
      <DialogTitle disableTypography>
        <Typography variant="h6">搜索</Typography>
        <IconButton aria-label="close" onClick={handleClose} className={classes.closeButton}>
          <CloseIcon/>
        </IconButton>
      </DialogTitle>
      <DialogContent>

        <form className={classes.form} onSubmit={handleSearch}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="select-group">要搜索的群组</InputLabel>
            <Select
              value={searchGroupUuid}
              onChange={(event) => {
                setSearchGroupUuid(event.target.value)
              }}
              inputProps={{
                name: 'select-group',
                id: 'select-group',
              }}
            >
              {
                groupList && groupList.map((item, index) => (
                  <MenuItem value={item.uuid} key={index}>{item.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>

          <FormControl className={classes.formControl}>
            <TextField
              margin="dense"
              id="search-text"
              label="搜索标题、内容"
              type="text"
              fullWidth
              autoFocus={true}
              required={true}
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value)
              }}
            />
          </FormControl>
          <FormControl className={classes.submitFormControl}>
            <FormControlLabel
              control={
                <Switch
                  checked={flagSearchDeep}
                  onChange={() => {
                    setFlagSearchDeep(v => !v)
                  }}
                  value={flagSearchDeep}
                  color="primary"
                />
              }
              label="搜索子群组"
            />
            <div>
              <Button
                className={clsx((!searchText.length && !resultList.length) ? classes.hidden : null)}
                onClick={clearSearch}
              >清除</Button>
              <Button
                className={classes.submitButton}
                variant='contained'
                type='submit'
                color="primary"
              >搜索</Button>
            </div>
          </FormControl>
        </form>
        <List>
          <Divider/>
          {
            resultList.map((entry, index) => {
              return <SearchListItem
                key={index}
                entry={entry}
                handleRightClick={handleRightClick}
              />
            })
          }
          {
            !resultList.length && <div className={classes.empty}>无搜索结果</div>
          }
        </List>
      </DialogContent>

      <EntryContextMenu
        ref={contextMenuRef}
        setUpdater={setUpdater}
        tellClickType={(type) => {
          if (type === MENU_ACTION_PREVIEW) {
            handleClose()
          }
        }}
      />
    </Dialog>
  )
}
