import TableCell from "@material-ui/core/TableCell"
import Checkbox from "@material-ui/core/Checkbox"
import {formatDateLite} from "../../utils"
import TableRow from "@material-ui/core/TableRow"
import React from "react"
import EntryIcon from "../EntryIcon"

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
          <EntryIcon entry={row._ref} title={"预览"}/>
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
