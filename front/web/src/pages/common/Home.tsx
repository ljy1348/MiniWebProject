import React, { useEffect } from 'react'
import UserService from '../../services/auth/UserService'
import { error } from 'console'

function Home() {

  useEffect(()=>{
    UserService.test()
    .then((response:any)=>{console.log(response)})
    .catch((error:Error)=>{console.log(error)})
    console.log(UserService.getUserName());

  // const token:any = localStorage.getItem("token");
  // const base64Url = token.split('.')[1];
  // const base64 = base64Url.replace('-', '+').replace('_', '/');
  // const decod = JSON.parse(window.atob(base64));
  // const role = decod.role;
  // console.log(role);


    
  },[])

  return (
    <div>Home</div>
  )
}

export default Home