import React from 'react';
import {useSelector, useDispatch} from 'react-redux'
import {Container} from "@material-ui/core"
import Button from '@material-ui/core/Button'
import {SET_UNLOCKED} from "../store"

export default function (props) {
  const state = useSelector(state => state)
  const dispatch = useDispatch()

  function toggle() {
    dispatch({type: SET_UNLOCKED, value: !state.unlocked})
  }

  return (
    <Container>
      <h1>List page</h1>

      <Button
        variant="contained"
        onClick={toggle}
      >Toggle</Button>

      <Button onClick={() => {
        props.history.push('/login')
      }}>Go Login</Button>

      <p>{JSON.stringify(state)}</p>
    </Container>
  )
}
