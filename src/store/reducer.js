import {SET_CURRENT_GROUP_UUID, SET_UNLOCKED} from "./index"

const initialState = {
  unlocked: false,
  currentGroupUuid: null
}

export default (state = initialState, action) => {

  switch (action.type) {
    case SET_UNLOCKED:
      return {
        ...state,
        unlocked: action.value
      }
    case SET_CURRENT_GROUP_UUID:
      return {
        ...state,
        currentGroupUuid: action.value
      }
    default:
      return state
  }
}
