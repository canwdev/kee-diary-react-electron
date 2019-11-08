import {saveKdbxDB} from "../store/setters"

// 注册键盘快捷键
export function registerKeyShortcuts() {
  window.addEventListener('keydown', handleKey)
}

export function unRegisterKeyShortcuts() {
  window.removeEventListener('keydown', handleKey)
}

function handleKey(event) {
  if (event.ctrlKey || event.metaKey) {
    switch (String.fromCharCode(event.which).toLowerCase()) {
      case 's':
        event.preventDefault();
        saveKdbxDB()
        break;
      default:
        return
    }
  }

}
