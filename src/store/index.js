import {createStore} from "redux"
import reducer from './reducer'

const store = createStore(reducer)
export default store

const md = require('markdown-it')({
  html: true,
  breaks: true,
  linkify: true,
})

// 存储全局变量（非响应式数据）
export let globalVars = {
  db: null, // 数据库实例，用 kdbxweb 创建
}

export const markdownIt = md

