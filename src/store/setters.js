import {
  SET_CALENDAR_DATE,
  SET_CURRENT_ENTRY,
  SET_CURRENT_GROUP_UUID,
  SET_DB_HAS_UNSAVED_CHANGE,
  SET_GROUP_LIST,
  SET_IS_DARK_MODE,
  SET_IS_LIST_VIEW,
  SET_PREVIEW,
  SET_SETTINGS,
  SET_UNLOCKED,
  SETTINGS_LOCALSTORAGE
} from "./actionTypes"
import store, {globalVars} from "./index"
import {deepWalkGroup, localStorageUtil} from "../utils"
import kdbxweb from "kdbxweb"
import {getDbHasUnsavedChange, getGlobalDB, getSettings} from "./getters"
import swal from 'sweetalert2';
import _debounce from 'lodash/debounce'

export function setSettings(settings) {
  localStorageUtil.setItem(SETTINGS_LOCALSTORAGE, settings)
  store.dispatch({type: SET_SETTINGS, value: settings})
}

export function setIsListView(flag = true) {
  localStorageUtil.setItem(SET_IS_LIST_VIEW, flag)
  store.dispatch({type: SET_IS_LIST_VIEW, value: flag})
}

export function setIsDarkMode(flag = true) {
  localStorageUtil.setItem(SET_IS_DARK_MODE, flag)
  store.dispatch({type: SET_IS_DARK_MODE, value: flag})
}

export function setGroupListByDB(db) {
  setGroupList(deepWalkGroup(db.groups))
}

export function setGroupList(list) {
  store.dispatch({type: SET_GROUP_LIST, value: list})
}

export function setCurrentGroupUuid(uuid) {
  store.dispatch({type: SET_CURRENT_GROUP_UUID, value: uuid})
}

export function setCurrentEntry(value) {
  store.dispatch({type: SET_CURRENT_ENTRY, value: value})
}

export function setPreview({show = false, entry = null}) {
  store.dispatch({type: SET_PREVIEW, value: {show, entry}})
}

export function setUnlocked(stat = false) {
  if (!stat) { // 关闭数据库
    if (getDbHasUnsavedChange()) { // 有未保存的数据
      swal.fire({
        title: '要保存数据库吗？',
        text: '您对数据库做了修改，但并未保存',
        icon: "question",
        showCancelButton: true,
        confirmButtonText: '保存并关闭',
        cancelButtonText: '不保存',
        showCloseButton: true,
      }).then((result) => {
        if (result.dismiss === swal.DismissReason.esc ||
          result.dismiss === swal.DismissReason.backdrop ||
          result.dismiss === swal.DismissReason.close) {
          return
        }
        if (result.value) {
          saveKdbxDB().then(() => {
            closeDbDirectly()
          })
        } else {
          closeDbDirectly()
        }
      })
    } else {
      closeDbDirectly()
    }
  } else {
    store.dispatch({type: SET_UNLOCKED, value: stat})
  }

  function closeDbDirectly() {
    setGlobalDB(null) // 销毁实例
    store.dispatch({type: SET_UNLOCKED, value: false})
    window.api.setShowExitPrompt(false) // 取消关闭前弹框警告
  }
}

// 有未保存的数据
function _setDbHasUnsavedChange(flag = true) {
  if (getDbHasUnsavedChange() === flag) return
  window.api.setShowExitPrompt(flag) // 设置关闭前弹框警告
  store.dispatch({type: SET_DB_HAS_UNSAVED_CHANGE, value: flag})
}

// 防止频繁设置
export const setDbHasUnsavedChange = _debounce(_setDbHasUnsavedChange, 1000, {
  'leading': true,
  'trailing': false
})

export function setGlobalDB(value) {
  return globalVars.db = value
}

export function loadKdbxDB(dbPath, password, keyPath) {
  const dbArrayBuffer = window.api.readFileSyncAsArrayBuffer(dbPath)

  let keyFileArrayBuffer
  if (keyPath) {
    keyFileArrayBuffer = window.api.readFileSyncAsArrayBuffer(keyPath)
  }

  let credentials = new kdbxweb.Credentials(kdbxweb.ProtectedValue.fromString(password), keyFileArrayBuffer);

  return kdbxweb.Kdbx.load(dbArrayBuffer, credentials)
}

// 防抖函数防止瞬间多次重复保存
export const saveKdbxDB = _debounce(_saveKdbxDB, 1000, {
  'leading': true,
  'trailing': false
})

function _saveKdbxDB() {
  const dbPath = getSettings().dbPath
  const db = getGlobalDB()
  return new Promise((resolve, reject) => {
    if (db) {
      db.save().then(dataAsArrayBuffer => {
        try {
          window.api.saveFileSyncAsArrayBuffer(dbPath, dataAsArrayBuffer)
          _setDbHasUnsavedChange(false)
          swal.fire({
            toast: true,
            position: 'top',
            timer: 1500,
            icon: 'success',
            showConfirmButton: false,
            title: "保存成功！",
            // text: dbPath
          })
          resolve('保存成功')
        } catch (e) {
          swal.fire({
            icon: 'error',
            title: '保存失败！',
            text: e
          })
          reject(e)
        }
      })
    } else {
      swal.fire({
        icon: 'error',
        title: '保存失败！',
        text: '数据库实例不存在'
      })
      reject('数据库实例不存在')
    }
  })
}

export function setCalendarDate(value) {
  store.dispatch({type: SET_CALENDAR_DATE, value})
}
