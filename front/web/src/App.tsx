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
import UserInfo from './pages/auth/User/UserInfo';
import Admin from './pages/auth/Admin/Admin';
import EditUserInfo from './pages/auth/User/EditUserInfo';
import Payment from './pages/other/Payment';
import PaySuccess from './pages/other/PaySuccess';

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
      if (UserService.getUserRole() == "ADMIN") setIsAdmin(true);
    } else {
      setIsLogin(false);
    } 
  },[isLogin]);

  useEffect(()=>{
    // 로그인 하면 sse연결하기
    if (isLogin) {
      const username = UserService.getUserName();
      eventSource.current = new EventSource(`http://13.124.103.146:8080/api/notification?username=${username}`, { withCredentials: true });
      // sse로 메세지 수신 될때 실행
    eventSource.current.onmessage = (event) => {
      setNotificationMessage(event.data);
      setIsNotification(true);
      setTimeout(() => {
        setIsNotification(false);
      }, 2000);
    };
    
    // sse 연결에 에러 발생했을때
    eventSource.current.onerror = (e:any) => {
      console.log(e);
    }

  } else {
    // 로그아웃시 sse 연결 클로즈
    if (eventSource.current)
    eventSource.current.close();
  }
  // 언마운트되면 연결 삭제
  return () => {
    if (eventSource.current) {
      eventSource.current.close();
    }
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
        <Route path='/info/edit' element={<EditUserInfo/>}/>

        {/* 게시판 */}
        <Route path='/board' element={<BoardList isLogin={isLogin}/>}></Route>
        <Route path='/board/:bid' element={<BoardRead/>}></Route>
        <Route path='/board/write' element={<BoardWrite setIsLogin={setIsLogin}/>}></Route>
        <Route path='/board/write/:bid' element={<BoardEdit setIsLogin={setIsLogin}/>}></Route>

        {/* 채팅 */}
        <Route path='/chat' element={<Chat isLogin={isLogin}/>}></Route>

        {/* 결제 */}
        <Route path='/pg' element={<Payment/>}></Route>
        <Route path='/success' element={<PaySuccess/>}></Route>
        

      </Routes>
      {isNotification &&
    <div className="popup">
      <span className="popupText">댓글이 달렸습니다 : {notificationMessage}</span>
    </div>}
    </div>
  );
}

export default App;
