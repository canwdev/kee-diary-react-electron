import React from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {Container} from "@material-ui/core"
import Button from '@material-ui/core/Button'
import {globalVars, SET_UNLOCKED} from "../store"

export default function (props) {
  const state = useSelector(state => state)
  const dispatch = useDispatch()

  function toggle() {
    dispatch({type: SET_UNLOCKED, value: !state.unlocked})
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
          onClick={()=>{
            console.log(globalVars.db)
          }}
        >打印 db 实例</Button>

        <Button onClick={() => {
          props.history.push('/login')
        }}>跳转 Login 页面</Button>
      </div>

      <p>{JSON.stringify(state)}</p>
    </Container>
  )
}
