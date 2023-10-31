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
import Chat from './pages/other/Chat';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  // const [eventSource, setEventSource] = useState<EventSource>();
  let eventSource:EventSource;

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
    // let eventSource:EventSource;
    if (isLogin) {
      const username = UserService.getUserName();
    // eventSource = new EventSource(`http://172.30.1.254:8080/api/notification?username=${username}`);
    // eventSource = new EventSource(`http://127.0.0.1:8080/api/notification?username=${username}`);
    eventSource = new EventSource(`http://59.28.90.58:8080/api/notification?username=${username}`, { withCredentials: true });
    // const eventSource = new EventSource(`https://ccd9-59-28-90-58.ngrok-free.app/api/notification?username=${username}`);

      eventSource.addEventListener("sse", (data)=>{
        console.log(data);
      })

      eventSource.onopen = (e) =>{console.log("오픈?");
    console.log(e);}

    eventSource.onmessage = (event) => {
      console.log("메세지왔음");
      setNotificationMessage(event.data);
      setIsNotification(true);
      setTimeout(() => {
        setIsNotification(false);
      }, 2000);
    };
    console.log(eventSource.readyState);

    eventSource.onerror = (e:any) => {
      console.log(e);
    }

  }
  },[isLogin])

  const ready = () => {
    console.log(eventSource.readyState);
  }

  return (
    <div className="App">
      <Header isLogin={isLogin} setIsLogin={setIsLogin}/>

      <Routes>
        {/* 홈 */}
        <Route path='/' element={<Home ready={ready}/>}></Route>

        {/* 회원가입/로그인 */}
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/login' element={<Login setIsLogin={setIsLogin}/>}></Route>

        {/* 게시판 */}
        <Route path='/board' element={<BoardList/>}></Route>
        <Route path='/board/:bid' element={<BoardRead/>}></Route>
        <Route path='/board/write' element={<BoardWrite setIsLogin={setIsLogin}/>}></Route>
        <Route path='/board/write/:bid' element={<BoardEdit setIsLogin={setIsLogin}/>}></Route>

        {/* 채팅 */}
        <Route path='/chat' element={<Chat/>}></Route>
        

      </Routes>
      {isNotification &&
    <div className="popup">
      <span className="popupText">댓글이 달렸습니다 : {notificationMessage}</span>
    </div>}
    </div>
  );
}

export default App;
