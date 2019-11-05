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

export function formatDate(date) {
  const year = date.getFullYear() + '年'
  const month = date.getMonth() + 1 + '月'
  const day = date.getDate() + '日'
  const hours = ' ' + date.getHours() + '时'
  const minutes = date.getMinutes() + '分'
  return [year, month, day, hours, minutes].join('')
}
