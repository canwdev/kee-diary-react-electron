import {
  SET_CURRENT_ENTRY,
  SET_CURRENT_GROUP_UUID,
  SET_DB_HAS_UNSAVED_CHANGE,
  SET_IS_DARK_MODE,
  SET_IS_LIST_VIEW,
  SET_SETTINGS, SET_PREVIEW,
  SET_UNLOCKED,
  SETTINGS_LOCALSTORAGE
} from "./actionTypes"
import {localStorageUtil} from "../utils"

const isListView = localStorageUtil.getItem(SET_IS_LIST_VIEW)
const isDarkMode = localStorageUtil.getItem(SET_IS_DARK_MODE)

const initialState = {
  settings: localStorageUtil.getItem(SETTINGS_LOCALSTORAGE) || { // 仅用于保存解锁设置
    dbPath: '',
    keyPath: '',
    password: '',
    rememberPathChecked: false,
  },
  isListView: isListView !== null ? isListView : true, // 是列表视图还是日历视图
  isDarkMode: isDarkMode !== null ? isDarkMode : false,
  preview: {
    show: false,
    entry: null
  },
  unlocked: false,
  dbHasUnsavedChange: false,
  currentGroupUuid: null,
  currentEntry: null,
}
export default (state = initialState, action) => {
  const type = action.type

  if (type === SET_SETTINGS) {
    return {
      ...state,
      settings: Object.assign(state.settings, action.value)
    }
  }

  if (type === SET_IS_LIST_VIEW) {
    return {
      ...state,
      isListView: action.value
    }
  }

  if (type === SET_IS_DARK_MODE) {
    return {
      ...state,
      isDarkMode: action.value
    }
  }

  if (type === SET_PREVIEW) {
    return {
      ...state,
      preview: action.value
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

  if (type === SET_CURRENT_ENTRY) {
    return {
      ...state,
      currentEntry: action.value
    }
  }

  return state
}
