import {iconMap} from "./icon-map"

export const localStorageUtil = {
  setItem(key, value) {
    return window.localStorage.setItem(key, JSON.stringify(value))
  },
  getItem(key) {
    const res = window.localStorage.getItem(key)
    try {
      return JSON.parse(res)
    } catch (e) {
      return res
    }

  },
  removeItem(key) {
    window.localStorage.removeItem(key)
  }
}

export function formatDateLite(d) {
  // let time = pad2Num(d.getHours()) + ':' + pad2Num(d.getMinutes())
  return d.toISOString().substr(0, 10)
}

export function formatDate(date) {
  const year = date.getFullYear() + '年'
  const month = date.getMonth() + 1 + '月'
  const day = date.getDate() + '日'
  const hours = ' ' + pad2Num(date.getHours()) + ':'
  const minutes = pad2Num(date.getMinutes()) + ':'
  const seconds = pad2Num(date.getSeconds())
  return [year, month, day, hours, minutes, seconds].join('')
}

export function pad2Num(num, len = 2) {
  return num.toString().padStart(len, '0')
}

/**
 * 递归遍历数据库 groups
 * usage: deepWalkGroup(db.groups)
 * return: customized group list
 */
export function deepWalkGroup(node, counter = 0) {
  const list = []
  if (!node || node.length === 0) return list

  node.forEach((group) => {
    const children = group.groups

    list.push({
      icon: iconMap[group.icon],
      uuid: group.uuid,
      name: group.name,
      index: counter,
      children: deepWalkGroup(children, counter + 1),
      _group: group
    })
  })
  return list
}
