import {showDetailWindow} from "../utils/db-actions"
import clsx from "clsx"
import {iconMap} from "../utils/icon-map"
import IconButton from "@material-ui/core/IconButton"
import React from "react"
import {makeStyles} from "@material-ui/core"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"

const useStyles = makeStyles(theme => ({
  icon: {
    fontSize: 20,
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconSmall: {
    width: '24px',
    height: '24px',
  }
}))

export default function (props) {
  const classes = useStyles()
  const {
    entry,
    title = "",
    titleExtra = "",
    small = false,
    disabled = false
  } = props

  // console.log(entry)

  return (
    <Tooltip title={
      <React.Fragment>
        <em>{titleExtra}</em>
        <Typography color="inherit">{title}</Typography>
      </React.Fragment>
    } arrow>
      <IconButton
        disabled={disabled}
        size="small"
        onClick={() => {
          showDetailWindow(entry)
        }}
      >
        <i
          style={{
            backgroundColor: entry.bgColor,
            color: entry.fgColor
          }}
          className={clsx(classes.icon, `fa fa-${iconMap[entry.icon]}`, small ? classes.iconSmall : null)}
        />
      </IconButton>
    </Tooltip>
  )
}
