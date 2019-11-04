import {SET_CURRENT_GROUP_UUID, SET_UNLOCKED} from "./actionTypes"
import {globalVars} from "./index"

export function setCurrentGroupUUID(dispatch, uuid) {
  dispatch({type: SET_CURRENT_GROUP_UUID, value: uuid})
}

export function setUnlocked(dispatch, stat = false) {
  dispatch({type: SET_UNLOCKED, value: stat})
}

export function setGlobalDB(value) {
  return globalVars.db = value
}
