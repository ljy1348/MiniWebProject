import React, { useEffect } from 'react'
import UserService from '../../services/auth/UserService'
import { error } from 'console'
import axios from 'axios'
import IUser from '../../types/auth/IUser'

function Home({setIsLogin, setIsAdmin}:{setIsLogin:any, setIsAdmin:any}) {

  // 일반회원 sse 테스트용
  const onClickSseUser = () =>{
    const username = "a";
    axios.get("/api/board/test/"+username)
    .then((response)=>{console.log(response)})
    .catch((response)=>{console.log(response)});
  }
  
  // 관리자 sse 테스트용
  const onClickSseAdmin = () =>{
    const username = "admin";
    axios.get("/api/board/test/"+username)
    .then((response)=>{console.log(response)})
    .catch((response)=>{console.log(response)});
  }

// 테스트 로그인용
  const buttonLogin = (id:string, pw:string) => {
    localStorage.removeItem('token');
    setIsLogin(false);
    const login:IUser = {userName : id, password:pw};
      UserService.login(login)
      .then((response) => {
              const token = response.headers['authorization'];
              localStorage.removeItem('token');
              localStorage.setItem("token",token);
              setIsLogin(true);
              if (UserService.getUserRole() === "ADMIN") {
                setIsAdmin(true);
              } else {
                setIsAdmin(false);
              }
          })
      .catch(error => {
        console.log(error)});
  }

  // 일반회원 로그인
  const onClickUser = () =>{
    buttonLogin("a","a");
  }
  // 관리자 로그인
  const onClickAdmin = () =>{
    buttonLogin("admin","admin");
  }
  // 최상위 관리자 로그인
  const onClickSuperAdmin = () =>{}

  return (
    <div>
      테스트용 로그인 버튼<br/><br/>
      <button onClick={onClickUser}>일반 회원</button><br/> 기능 : 게시글 및 댓글 등록/수정/삭제, 회원정보 페이지<br/><br/>
      <button onClick={onClickAdmin}>관리자</button><br/> 기능 : 일반 회원 기능 + 타인 작성 글 삭제<br/><br/>
      <button onClick={onClickSuperAdmin}>최상위 관리자</button><br/> 기능 : 관리자 기능 + 계정 권한 변경<br/><br/>
      


    <button onClick={onClickSseUser}>일반 회원에게 알림 전송</button> <br/>
    <button onClick={onClickSseAdmin}>관리자에게 알림 전송</button>
    </div>
  )
}

export default Home