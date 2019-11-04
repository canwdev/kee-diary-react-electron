import {globalVars, initialState} from "./index"
import {SET_CURRENT_GROUP_UUID, SET_UNLOCKED} from "./actionTypes"

export default (state = initialState, action) => {

  switch (action.type) {
    case SET_UNLOCKED:
      const newState = {
        ...state,
        unlocked: action.value
      }
      if (!action.value) { // 为 false 时清除内存数据
        console.log(globalVars.db)
        newState.currentGroupUuid = null
      }
      return newState
    case SET_CURRENT_GROUP_UUID:
      return {
        ...state,
        currentGroupUuid: action.value
      }
    default:
      return state
  }
}
