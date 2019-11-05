import React from 'react';
import {useSelector} from 'react-redux'
import {Container} from "@material-ui/core"
import Button from '@material-ui/core/Button'
import {setUnlocked} from "../store/setters"
import {getGlobalDB} from "../store/getters"

export default function (props) {
  const state = useSelector(state => state)

  function toggle() {
    setUnlocked(!state.unlocked)
  }

  return (
    <Container>
      <h1>调试工具</h1>

      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={toggle}
        >切换 unlocked</Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            console.log(getGlobalDB())
          }}
        >打印 db 实例</Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            console.log(state)
          }}
        >打印 redux state</Button>

        <Button onClick={() => {
          props.history.push('/login')
        }}>跳转 Login 页面</Button>
      </div>

    </Container>
  )
}
