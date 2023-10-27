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

function App() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(()=>{
    if (UserService.isTokenExp()) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }


        
  });

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
        <Route path='/board/write/:bid' element={<BoardWrite setIsLogin={setIsLogin}/>}></Route>
        

      </Routes>
    </div>
  );
}

export default App;
