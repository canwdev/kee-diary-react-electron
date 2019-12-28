import {saveKdbxDB, setUnlocked} from "../store/setters"

// 注册键盘快捷键
export function registerKeyShortcuts() {
  window.addEventListener('keydown', handleKey)
  window.addEventListener('click', handleClick)
}

export function unRegisterKeyShortcuts() {
  window.removeEventListener('keydown', handleKey)
  window.removeEventListener('click', handleClick)
}

function handleKey(event) {
  if (event.ctrlKey || event.metaKey) {
    switch (String.fromCharCode(event.which).toLowerCase()) {
      case 's':
        event.preventDefault();
        saveKdbxDB()
        break;
      case 'l':
        event.preventDefault();
        setUnlocked()
        break;
      default:
        return
    }
  }

}

function handleClick(event) {
  // 在外部打开链接
  if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
    event.preventDefault()
    window.api.openExternal(event.target.href)
  }
}
