import React, { useEffect } from 'react'
import UserService from '../../services/auth/UserService'
import { error } from 'console'
import axios from 'axios'

function Home() {

  // useEffect(()=>{
  //   UserService.test()
  //   .then((response:any)=>{})
  //   .catch((error:Error)=>{})
  //   // console.log(UserService.getUserName());
  // },[])

  const onClickEvent = () =>{
    axios.get("http://localhost:8080/api/board/test")
  }

  return (
    <div>Home<br/>
    <button onClick={onClickEvent}>눌러라!</button>
    </div>
  )
}

export default Home