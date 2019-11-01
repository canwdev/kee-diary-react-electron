import {createStore} from "redux"
import reducer from './reducer'

export const SET_UNLOCKED = Symbol('SET_UNLOCKED')

const store = createStore(reducer)
export default store
