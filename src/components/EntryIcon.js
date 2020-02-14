import {showDetailWindow} from "../utils/actions"
import clsx from "clsx"
import {iconMap} from "../utils/icon-map"
import IconButton from "@material-ui/core/IconButton"
import React from "react"
import {makeStyles} from "@material-ui/core"
import Tooltip from "@material-ui/core/Tooltip"

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
  const {entry, title = "", small = false, disabled=false} = props

  return (
    <Tooltip title={title}>
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
