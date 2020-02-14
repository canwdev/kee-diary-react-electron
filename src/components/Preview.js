import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import CloseIcon from "@material-ui/icons/Close"
import {makeStyles} from "@material-ui/core/styles"
import {useSelector} from "react-redux"
import {selectorIsDarkMode, selectorPreview} from "../store/getters"
import {markdownIt} from "../store"
import {setPreview} from "../store/setters"
import clsx from "clsx"
import {formatDate} from "../utils"
import {iconMap} from "../utils/icon-map"

const useStyles = makeStyles(theme => ({
  dialogTitle: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  entryInfo: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: '10px',
    '&>span': {
      border: '1px solid',
      color: theme.palette.primary.main,
      background: theme.palette.background.paper,
      padding: '1px 4px',
      borderRadius: '5px',
      marginRight: '5px'
    }
  }
}))

export default function Preview() {
  const classes = useStyles();
  const preview = useSelector(selectorPreview)
  const darkMode = useSelector(selectorIsDarkMode)

  const entry = preview.entry
  // console.log(entry)

  const handleClose = () => {
    setPreview({
      show: false,
      entry: null
    })
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth='md'
      open={preview.show}
      onClose={handleClose}
    >
      <DialogTitle disableTypography>
        <Typography variant="h6">{entry && entry.fields.Title}</Typography>
        <IconButton aria-label="close" onClick={handleClose} className={classes.closeButton}>
          <CloseIcon/>
        </IconButton>
      </DialogTitle>
      {
        entry && (
          <DialogContent
            dividers={true}
          >
            <div className={classes.entryInfo}>
              <span>
                <i
                  style={{
                    backgroundColor: entry.bgColor,
                    color: entry.fgColor
                  }}
                  className={clsx(`fa fa-${iconMap[entry.icon]}`)}
                />
              </span>
              <span>群组：{entry.parentGroup.name}</span>
              <span>创建：{formatDate(entry.times.creationTime)}</span>
              <span>修改：{formatDate(entry.times.creationTime)}</span>
            </div>
            <div
              className={clsx('__view-detail-note', darkMode ? 'markdown-body-dark' : 'markdown-body')}
              dangerouslySetInnerHTML={{__html: markdownIt.render(entry.fields.Notes)}}
            />
          </DialogContent>
        )
      }
    </Dialog>
  )
}
