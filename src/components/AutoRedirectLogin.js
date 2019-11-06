import {Redirect} from "react-router-dom";
import React from "react"
import {useSelector} from "react-redux"

export default function () {
  const unlocked = useSelector(state => state.unlocked);

  return (
    <>
      {!unlocked ? <Redirect to="/"/> : <Redirect to="/view-list"/>}
    </>
  )
}
