import React, {useState} from "react"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogActions from "@material-ui/core/DialogActions"

export default function DialogConfirm(props) {
  const [open, setOpen] = useState(false)

  const {title = 'Title', content = 'Content'} = props

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          确定
        </Button>
        <Button onClick={handleClose}>
          取消
        </Button>
      </DialogActions>
    </Dialog>
  )
}
