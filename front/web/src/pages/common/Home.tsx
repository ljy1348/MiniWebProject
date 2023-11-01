import React, { useEffect } from 'react'
import UserService from '../../services/auth/UserService'
import { error } from 'console'
import axios from 'axios'

function Home({ready}:{ready:any}) {

  // useEffect(()=>{
  //   UserService.test()
  //   .then((response:any)=>{})
  //   .catch((error:Error)=>{})
  //   // console.log(UserService.getUserName());
  // },[])

  const onClickEvent = () =>{
    axios.get("/api/board/test")
    .then((response)=>{console.log(response)})
    .catch((response)=>{console.log(response)});

    // ready();

  }

  return (
    <div>알림 테스트<br/>
    id : a, pw : a 로 로그인 해주세요.
    <br/>

    <button onClick={onClickEvent}>알림 전송</button>
    </div>
  )
}

export default Home