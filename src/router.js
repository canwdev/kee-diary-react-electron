import Login from "./pages/Login"
import List from './pages/List'

const router = [
  {path: '/login', exact: true, title: '打开数据库', component: Login},
  {path: '/list', exact: true, title: '数据列表', component: List},
]

export default router
