export const lsUtil = {
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
