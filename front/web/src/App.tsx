import React, { useEffect, useRef, useState } from 'react';
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
import Chat from './pages/other/Chat';
import UserInfo from './pages/auth/UserInfo';
import Admin from './pages/auth/Admin';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const eventSource = useRef<EventSource | null>(null);

  // 토큰 만료 확인
  useEffect(()=>{
    if (UserService.isTokenExp()) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    } 
  },[isLogin]);

  // 로그인 하면 sse연결하기
  useEffect(()=>{
    // let eventSource:EventSource;
    if (isLogin) {
      const username = UserService.getUserName();
      eventSource.current = new EventSource(`http://59.28.90.58:8080/api/notification?username=${username}`, { withCredentials: true });

    eventSource.current.onmessage = (event) => {
      setNotificationMessage(event.data);
      setIsNotification(true);
      setTimeout(() => {
        setIsNotification(false);
      }, 2000);
    };

    eventSource.current.onerror = (e:any) => {
      console.log(e);
    }

  } else {
    if (eventSource.current)
    eventSource.current.close();
  }
  },[isLogin])

  return (
    <div className="App">
      <Header isLogin={isLogin} setIsLogin={setIsLogin} isAdmin={isAdmin} setIsAdmin={setIsAdmin}/>
      {/* <button onClick={}>버튼</button> */}

      <Routes>
        {/* 홈 */}
        <Route path='/' element={<Home setIsLogin={setIsLogin} setIsAdmin={setIsAdmin}/>}></Route>

        {/* 회원가입/로그인 */}
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/login' element={<Login setIsLogin={setIsLogin} setIsAdmin={setIsAdmin}/>}></Route>
        <Route path='/info' element={<UserInfo/>}></Route>
        <Route path='/admin' element={<Admin/>}></Route>

        {/* 게시판 */}
        <Route path='/board' element={<BoardList/>}></Route>
        <Route path='/board/:bid' element={<BoardRead/>}></Route>
        <Route path='/board/write' element={<BoardWrite setIsLogin={setIsLogin}/>}></Route>
        <Route path='/board/write/:bid' element={<BoardEdit setIsLogin={setIsLogin}/>}></Route>

        {/* 채팅 */}
        <Route path='/chat' element={<Chat isLogin={isLogin}/>}></Route>
        

      </Routes>
      {isNotification &&
    <div className="popup">
      <span className="popupText">댓글이 달렸습니다 : {notificationMessage}</span>
    </div>}
    </div>
  );
}

export default App;
