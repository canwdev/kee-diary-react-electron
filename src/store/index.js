import {createStore} from "redux"
import reducer from './reducer'

export const initialState = {
  unlocked: false,
  currentGroupUuid: null
}

const store = createStore(reducer)
export default store

// 存储全局变量（非响应式数据）
export let globalVars = {
  db: null // 数据库实例，用 kdbxweb 创建
}

