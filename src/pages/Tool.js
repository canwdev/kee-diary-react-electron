import React, {useEffect} from 'react';
import {useSelector} from 'react-redux'
import {Container} from "@material-ui/core"
import {setUnlocked} from "../store/setters"
import {getGlobalDB} from "../store/getters"
import swal from "sweetalert2"

export default function (props) {
  const state = useSelector(state => state)

  function toggle() {
    setUnlocked(!state.unlocked)
  }

  useEffect(() => {
    console.log('tools mounted')

    return () => {
      console.log('tools unmounted')
    }
  }, [])

  return (
    <Container>
      <h1>调试工具</h1>

      <div>
        <button
          variant="contained"
          color="secondary"
          onClick={toggle}
        >切换 unlocked</button>

        <button
          variant="contained"
          color="primary"
          onClick={() => {
            console.log(getGlobalDB())
          }}
        >打印 db 实例</button>

        <button
          variant="contained"
          color="primary"
          onClick={() => {
            console.log(state)
          }}
        >打印 redux state</button>

        <button onClick={() => {
          props.history.push('/')
        }}>跳转 Login 页面</button>

        <button onClick={()=>{
          swal.fire({
            toast: true,
            position: 'top',
            timer: 1500,
            icon: 'success',
            showConfirmButton: false,
            title: "成功！",
            text: `https://sweetalert2.github.io/#input-types`
          })
        }}>Swal!</button>
      </div>

    </Container>
  )
}
