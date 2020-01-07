import TableCell from "@material-ui/core/TableCell"
import Checkbox from "@material-ui/core/Checkbox"
import IconButton from "@material-ui/core/IconButton"
import {showDetailWindow} from "./utils"
import clsx from "clsx"
import {formatDateLite} from "../../utils"
import TableRow from "@material-ui/core/TableRow"
import React from "react"
import Tooltip from "@material-ui/core/Tooltip"

export default function ListItem(props) {
  const {
    row,
    currentEntry,
    classes,
    rowChecked,
    handleRightClick,
    handleCheckEntry,
    handleEntryItemClick,
    // setUpdater
  } = props
  return (
    <TableRow
      selected={currentEntry.uuid.id === row.uuid.id}
      key={row.uuid.id}
      className={classes.tableRow}
      onContextMenu={(event) => {
        handleRightClick(event, row)
      }}
    >
      <TableCell padding="checkbox">
        <div className={classes.checkboxWrap}>
          <Checkbox
            className={classes.checkBox}
            checked={rowChecked}
            onClick={() => {
              handleCheckEntry(row)
            }}
          />
          <Tooltip title="预览">
            <IconButton
              size="small"
              onClick={() => {
                // handleChangeColor(row._ref).then(()=>{setUpdater(v => !v)})
                showDetailWindow(row._ref)
              }}
            >
              <i
                style={{
                  backgroundColor: row.bgColor,
                  color: row.fgColor
                }}
                className={clsx(classes.icon, `fa fa-${row.icon}`)}
              />
            </IconButton>
          </Tooltip>
        </div>

      </TableCell>
      <TableCell
        className={classes.tableCell}
        onClick={() => {
          handleEntryItemClick(row)
        }}
      >
        <span>{row.title}</span>
      </TableCell>
      <TableCell
        className={classes.tableCell}
        onClick={() => {
          handleEntryItemClick(row)
        }}
      >{formatDateLite(row.creationTime)}</TableCell>
      <TableCell
        onClick={() => {
          handleEntryItemClick(row)
        }}
      >{formatDateLite(row.lastModTime)}</TableCell>
    </TableRow>
  )
}
