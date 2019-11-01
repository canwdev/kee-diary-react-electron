import Login from "./pages/Login"
import Tool from './pages/Tool'

const router = [
  {path: '/login', exact: true, title: '打开数据库', component: Login},
  {path: '/tool', exact: true, title: '调试工具', component: Tool},
]

export default router
