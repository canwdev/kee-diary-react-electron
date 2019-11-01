import {SET_UNLOCKED} from "./index"

const defaultState = {
  unlocked: false
}

export default (state = defaultState, action) => {
  const newState = JSON.parse(JSON.stringify(state))

  switch (action.type) {
    case SET_UNLOCKED:
      newState.unlocked = action.value
      return newState
    default:
      return state
  }
}
