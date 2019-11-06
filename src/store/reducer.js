import {
  SET_CURRENT_ENTRY_UUID,
  SET_CURRENT_GROUP_UUID,
  SET_DB_HAS_UNSAVED_CHANGE,
  SET_SETTINGS,
  SET_UNLOCKED,
  SETTINGS_LOCALSTORAGE
} from "./actionTypes"
import {localStorageUtil} from "../utils"

const initialState = {
  settings: localStorageUtil.getItem(SETTINGS_LOCALSTORAGE) || {
    dbPath: '',
    keyPath: '',
    password: '',
    rememberPathChecked: false,
  },
  unlocked: false,
  dbHasUnsavedChange: false,
  currentGroupUuid: null,
  currentEntry: null,
}
export default (state = initialState, action) => {
  const type = action.type

  if (type === SET_SETTINGS) {
    const settings =  Object.assign(state.settings, action.value)
    return {
      ...state,
      settings
    }
  }

  if (type === SET_UNLOCKED) {
    const newState = {
      ...state,
      unlocked: action.value
    }
    if (!action.value) { // 关闭数据库
      newState.dbHasUnsavedChange = false
      newState.currentGroupUuid = null
      newState.currentEntry = null
    }
    return newState
  }

  if (type === SET_DB_HAS_UNSAVED_CHANGE) {
    return {
      ...state,
      dbHasUnsavedChange: action.value
    }
  }

  if (type === SET_CURRENT_GROUP_UUID) {
    return {
      ...state,
      currentGroupUuid: action.value
    }
  }

  if (type === SET_CURRENT_ENTRY_UUID) {
    return {
      ...state,
      currentEntry: action.value
    }
  }

  return state
}
