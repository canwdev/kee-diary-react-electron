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
  }
}))

export default function Preview() {
  const classes = useStyles();
  const preview = useSelector(selectorPreview)
  const darkMode = useSelector(selectorIsDarkMode)

  let entry = preview.entry || {
    fields: {
      Title: '',
      Notes: '',
    }
  }

  const {
    fields: {
      Title: title,
      Notes: note
    }
  } = entry

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
        <Typography variant="h6">{title}</Typography>
        <IconButton aria-label="close" onClick={handleClose} className={classes.closeButton}>
          <CloseIcon/>
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers={true}
      >
        <div
          className={clsx('__view-detail-note', darkMode ? 'markdown-body-dark' : 'markdown-body')}
          dangerouslySetInnerHTML={{__html: markdownIt.render(note)}}
        />
      </DialogContent>
    </Dialog>
  )
}
