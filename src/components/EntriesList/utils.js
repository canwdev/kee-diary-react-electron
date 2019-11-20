import swal from "sweetalert2"
import {getIsRecycleBinEnabled} from "../../store/getters"
import React from "react"
import ReactDOM from "react-dom"
import {deepWalkGroup} from "../../utils"

export function confirmMoveToGroupChooser(db) {
  let selectedGroup = null

  function generateGroupSelector(list, counter = 0) {
    const VDOM = []
    if (!list || list.length === 0) return null

    list.forEach(item => {
      const children = item.children
      VDOM.push(
        <div
          key={item.uuid}
          className="__nested"
        >
          <label className="__target-group">
            <input
              type="radio"
              name="target-group"
              onClick={() => {
                selectedGroup = item._ref
              }}
            />
            <span>{item.name}</span>
          </label>
          {generateGroupSelector(children, counter + 1)}
        </div>
      )
    })
    return VDOM
  }

  return new Promise((resolve, reject) => {
    swal.fire({
      title: '请选择目标群组',
      html: ReactDOM.render((
        <div style={{textAlign: 'left'}}>
          {generateGroupSelector(deepWalkGroup(db.groups))}
        </div>
      ), document.createElement('div')),
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        return selectedGroup
      }
    }).then(res => {
      if (!res.dismiss && res.value) {
        return resolve(selectedGroup)
      } else {
        return reject()
      }
    })

  })
}

export function confirmDeleteEntry(entry) {
  return new Promise((resolve, reject) => {
    const title = entry.fields.Title

    swal.fire({
      title: '确认删除',
      text: getIsRecycleBinEnabled() ? `确定要将《${title}》移动至回收站吗？` : `确定要永久删除《${title}》吗？`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.value) {
        return resolve()
      } else {
        return reject()
      }
    })

  })

}

export function confirmDeleteEntries(numSelected) {
  return new Promise((resolve, reject) => {
    swal.fire({
      title: getIsRecycleBinEnabled() ? `确定要将这些条目移动至回收站吗？` : `确定要永久删除这些条目吗？`,
      text: '共选择了' + numSelected + '个条目',
      icon: "question",
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.value) {
        return resolve()
      } else {
        return reject()
      }
    })
  })
}
