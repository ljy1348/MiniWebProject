import React, { useEffect } from 'react'
import UserService from '../../services/auth/UserService'
import { error } from 'console'

function Home() {

  useEffect(()=>{
    UserService.test()
    .then((response:any)=>{console.log(response)})
    .catch((error:Error)=>{console.log(error)})

    console.log(UserService.getUserName());
  },[])

  return (
    <div>Home</div>
  )
}

export default Home