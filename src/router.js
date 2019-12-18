import Login from "./pages/Login"
import ViewList from "./pages/ViewList"
import EntryDetail from './pages/EntryDetail'
import Tool from './pages/Tool'

const router = [
  {path: '/', exact: true, title: '打开数据库', component: Login},
  {path: '/view-list', exact: true, title: '查看数据库', component: ViewList},
  {path: '/item-detail', exact: true, title: '写作', component: EntryDetail},
  {path: '/tool', exact: true, title: '调试工具', component: Tool},
]

export default router
