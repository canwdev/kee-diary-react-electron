import {Paper} from "@material-ui/core"
import React from "react"
import {makeStyles} from "@material-ui/core/styles"
import {getGlobalDB, selectorCurrentGroupUuid} from "../../store/getters"
import {useSelector} from "react-redux"
import Calendar from './Calendar'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: '100%',
    height: 'calc(95vh - 60px)',
    minHeight: '200px',
    overflow: 'auto',
  }
}))

export default function () {
  const classes = useStyles();
  const db = getGlobalDB()
  const groupUuid = useSelector(selectorCurrentGroupUuid);

  return (
    <Paper className={classes.root}>
      {/*<p style={{position: 'absolute', pointerEvents: 'none'}}>{ groupUuid && groupUuid.id}</p>*/}
      <Calendar/>
    </Paper>
  )
}
