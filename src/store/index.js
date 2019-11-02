import {createStore} from "redux"
import reducer from './reducer'

export const SET_UNLOCKED = Symbol()
export const SET_CURRENT_GROUP_UUID = Symbol()

// 存储全局变量（非响应式数据）
export let globalVars = {
  db: null // 数据库实例
}

const store = createStore(reducer)
export default store
