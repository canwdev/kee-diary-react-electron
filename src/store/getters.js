import store, {globalVars} from "./index"

// selectors
export const selectorSettings = state => state.settings
export const selectorIsListView = state => state.isListView
export const selectorIsDarkMode = state => state.isDarkMode
export const selectorPreview = state => state.preview
export const selectorUnlocked = state => state.unlocked
export const selectorCurrentGroupUuid = state => state.currentGroupUuid
export const selectorGroupList = state => state.groupList
export const selectorCurrentEntry = state => state.currentEntry
export const selectorDbHasUnsavedChange = state => state.dbHasUnsavedChange

// getters
export const getSettings = () => store.getState().settings
export const getDbHasUnsavedChange = () => store.getState().dbHasUnsavedChange

export function getGlobalDB() {
  return globalVars.db
}

export function getIsRecycleBinEnabled() {
  return globalVars.db.meta.recycleBinEnabled
}

export function getIsRecycleBin(groupUuid) {
  return groupUuid.id === globalVars.db.meta.recycleBinUuid.id
}
