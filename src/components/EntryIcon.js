import {showDetailWindow} from "./EntriesList/utils"
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
    width: '18px',
    height: '18px',
  }
}))

export default function (props) {
  const classes = useStyles()
  const {entry, title = "", small = false} = props

  return (
    <Tooltip title={title}>
      <IconButton
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
