import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/common/Home';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import UserService from './services/auth/UserService';
import BoardList from './pages/board/BoardList';
import BoardWrite from './pages/board/BoardWrite';
import BoardRead from './pages/board/BoardRead';
import BoardEdit from './pages/board/BoardEdit';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // 토큰 만료 확인
  useEffect(()=>{
    if (UserService.isTokenExp()) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    } 
  },[]);

  // 로그인 하면 sse연결하기
  useEffect(()=>{
    if (isLogin) {
      const username = UserService.getUserName();
    const eventSource = new EventSource(`http://localhost:8080/api/notification?username=${username}`);


    eventSource.onmessage = (event) => {
      // console.log("메세지왔음");
      setNotificationMessage(event.data);
      setIsNotification(true);
      setTimeout(() => {
        setIsNotification(false);
      }, 2000);
    };

    eventSource.close = () => {
      console.log("sse 끊김");
    }

    }
  },[isLogin])

  return (
    <div className="App">
      <Header isLogin={isLogin} setIsLogin={setIsLogin}/>

      <Routes>
        {/* 홈 */}
        <Route path='/' element={<Home/>}></Route>

        {/* 회원가입/로그인 */}
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/login' element={<Login setIsLogin={setIsLogin}/>}></Route>

        {/* 게시판 */}
        <Route path='/board' element={<BoardList/>}></Route>
        <Route path='/board/:bid' element={<BoardRead/>}></Route>
        <Route path='/board/write' element={<BoardWrite setIsLogin={setIsLogin}/>}></Route>
        <Route path='/board/write/:bid' element={<BoardEdit setIsLogin={setIsLogin}/>}></Route>
        

      </Routes>
      {isNotification &&
    <div className="popup">
      <span className="popupText">댓글이 달렸습니다 : {notificationMessage}</span>
    </div>}
    </div>
  );
}

export default App;
