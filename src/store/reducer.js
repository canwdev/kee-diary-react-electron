import {SET_UNLOCKED} from "./index"

const initialState = {
  unlocked: false
}

export default (state = initialState, action) => {

  switch (action.type) {
    case SET_UNLOCKED:
      return {
        ...state,
        unlocked: action.value
      }
    default:
      return state
  }
}
