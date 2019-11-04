import {globalVars} from "./index"

export const getUnlocked = store => store.getState().unlocked

export function getGlobalDB() {
  return globalVars.db
}
