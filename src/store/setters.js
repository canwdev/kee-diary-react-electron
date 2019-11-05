import {
  SET_CURRENT_ENTRY_UUID,
  SET_CURRENT_GROUP_UUID,
  SET_DB_HAS_UNSAVED_CHANGE,
  SET_SETTINGS,
  SET_UNLOCKED,
  SETTINGS_LOCALSTORAGE
} from "./actionTypes"
import store, {globalVars} from "./index"
import {localStorageUtil} from "../utils"
import kdbxweb from "kdbxweb"
import {getGlobalDB} from "./getters"
import swal from 'sweetalert';

export function setSettings(settings) {
  localStorageUtil.setItem(SETTINGS_LOCALSTORAGE, settings)
  store.dispatch({type: SET_SETTINGS, value: settings})
}

export function setCurrentGroupUuid(uuid) {
  store.dispatch({type: SET_CURRENT_GROUP_UUID, value: uuid})
}

export function setCurrentEntry(value) {
  store.dispatch({type: SET_CURRENT_ENTRY_UUID, value: value})
}


export function setUnlocked(stat = false) {
  if (!stat) { // 关闭数据库
    setGlobalDB(null) // 销毁实例
  }
  store.dispatch({type: SET_UNLOCKED, value: stat})
}

export function setDbHasUnsavedChange(stat = true) {
  store.dispatch({type: SET_DB_HAS_UNSAVED_CHANGE, value: stat})
}

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

export function saveKdbxDB(dbPath) {
  const db = getGlobalDB()
  if (db) {
    db.save().then(dataAsArrayBuffer => {
      try {
        window.api.saveFileSyncAsArrayBuffer(dbPath, dataAsArrayBuffer)
        setDbHasUnsavedChange(false)
        swal("保存成功！", `数据库已保存至\n${dbPath}`, "success");
      } catch (e) {
        swal("保存失败！", e, "error");
      }
    })
  } else {
    swal("保存失败！", "数据库实例不存在", "error");
  }
}
