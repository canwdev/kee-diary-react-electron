import Toolbar from "@material-ui/core/Toolbar"
import clsx from "clsx"
import Typography from "@material-ui/core/Typography"
import Tooltip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"
import DeleteIcon from '@material-ui/icons/Delete';
import React from "react"
import {makeStyles} from "@material-ui/core"
import {lighten} from "@material-ui/core/styles"
import {setCurrentGroupUuid, setDbHasUnsavedChange} from "../../store/setters"
import {confirmDeleteEntries, confirmMoveToGroupChooser} from "./utils"
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';

const useToolbarStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    width: '100%',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    display: 'none',
    minHeight: '56px'
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        display: 'flex',
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        display: 'flex',
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));


export const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const {db, checked, setChecked, setUpdater} = props;
  const numSelected = checked.length

  function handleMoveEntries() {
    confirmMoveToGroupChooser(db).then(selectedGroup => {
      let newChecked = checked

      checked.forEach(item => {
        db.move(item._ref, selectedGroup);
        setDbHasUnsavedChange()
        newChecked = newChecked.filter(i => i !== item)
      })

      setChecked(newChecked)
      setCurrentGroupUuid(selectedGroup.uuid)
      setUpdater(v => !v)
    })
  }

  function handleDeleteEntries() {
    confirmDeleteEntries(numSelected).then(() => {
      let newChecked = checked

      checked.forEach(item => {
        db.remove(item._ref);
        setDbHasUnsavedChange()
        newChecked = newChecked.filter(i => i !== item)
      })

      setChecked(newChecked)
      setUpdater(v => !v)
    })
  }

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <Typography className={classes.title} color="inherit" variant="subtitle1">
        批量操作：已选择 {numSelected} 个条目
      </Typography>

      <Tooltip title="移动至群组">
        <IconButton onClick={handleMoveEntries} aria-label="move">
          <DoubleArrowIcon/>
        </IconButton>
      </Tooltip>
      <Tooltip title="删除条目">
        <IconButton onClick={handleDeleteEntries} aria-label="delete">
          <DeleteIcon/>
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};