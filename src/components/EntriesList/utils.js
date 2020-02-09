import swal from "sweetalert2"
import {getIsRecycleBin, getIsRecycleBinEnabled} from "../../store/getters"
import React from "react"
import ReactDOM from "react-dom"
import ColorPicker from "../ColorPicker"
import {deepWalkGroup} from "../../utils"
import {markdownIt} from "../../store"
import {iconMap} from "../../utils/icon-map"
import clsx from 'clsx'
import {setCurrentEntry, setDbHasUnsavedChange} from "../../store/setters"

/**
 * 移动至群组
 * @param db
 * @returns {Promise<unknown>}
 */
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
                selectedGroup = item._entry
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

/**
 * 确认删除条目对话框
 */
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

/**
 * 确认删除群组对话框
 */
export function confirmDeleteGroup(group) {
  return new Promise((resolve, reject) => {
    const isRecycleBin = getIsRecycleBin(group.uuid)
    const name = group.name

    swal.fire({
      title: isRecycleBin ? '清空回收站' : '确认删除',
      text: isRecycleBin ? '确定要删除回收站中的所有数据吗？' :
        (getIsRecycleBinEnabled() ? `确定要将《${name}》移动至回收站吗？` : `确定要永久删除《${name}》吗？其中的所有条目将被删除！`),
      icon: "warning",
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


/**
 * 确认删除对话框（多选）
 * @param numSelected 个数
 */
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

/**
 * 显示 markdown编译后 预览窗口
 */
export function showDetailWindow(entry) {
  const {
    fields: {
      Title: title,
      Notes: note
    }
  } = entry

  const html = markdownIt.render(note)

  swal.fire({
    title: title,
    html: ReactDOM.render((
      <div
        className="__view-detail-note markdown-body"
        dangerouslySetInnerHTML={{__html: html}}
      >
      </div>
    ), document.createElement('div')),
    showConfirmButton: false,
    showCloseButton: true,
    customClass: {
      container: '__swal-container',
      title: '__swal-title',
    }
  })
}

/**
 * 修改前景色
 */
export function handleChangeColor(entry) {
  return new Promise((resolve, reject) => {
    let selectedColor = null
    swal.fire({
      title: '选择颜色',
      width: 278,
      html: ReactDOM.render((
        <div>
          <ColorPicker updateColor={(color) => {
            selectedColor = color
          }}/>
        </div>
      ), document.createElement('div'))
    }).then((result) => {
      if (result.value && selectedColor) {
        entry.fgColor = selectedColor.hex
        setDbHasUnsavedChange()
        setCurrentEntry(entry)

        return resolve()
      } else {
        return reject()
      }
    })
  })
}

/**
 * 修改图标
 */
export function handleChangeIcon(entry) {
  return new Promise((resolve, reject) => {
    let {icon: iconIndex} = entry
    swal.fire({
      title: '选择图标',
      html: ReactDOM.render((
        <div className="__icon-chooser-wrap">
          {
            iconMap.map((icon, index) => {
              return (
                <label className="__icon-item" key={index}>
                  <input type="radio" name="icon-group"/>
                  <i
                    className={clsx(
                      iconIndex === index ? 'active' : '',
                      `fa fa-${icon}`
                    )}
                    title={index}

                    onClick={()=>{
                      iconIndex = index
                    }}
                  />
                </label>

              )
            })
          }
        </div>
      ), document.createElement('div'))
    }).then((result) => {
      if (result.value && iconIndex) {
        entry.icon = iconIndex
        setDbHasUnsavedChange()
        setCurrentEntry(entry)

        return resolve()
      } else {
        return reject()
      }
    })
  })
}

/**
 * 进入详情页面（编辑模式）
 */
export function handleEnterEntry(history, entry) {
  setCurrentEntry(entry)
  history.push('/item-detail')
}
