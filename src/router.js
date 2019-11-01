import Login from "./pages/Login"
import Detail from "./pages/Detail"
import Tool from './pages/Tool'

const router = [
  {path: '/login', exact: true, title: '打开数据库', component: Login},
  {path: '/detail', exact: true, title: '查看数据库', component: Detail},
  {path: '/tool', exact: true, title: '调试工具', component: Tool},
]

export default router
