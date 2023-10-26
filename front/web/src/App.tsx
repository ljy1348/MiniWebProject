import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/common/Home';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <div className="App">
      <Header isLogin={isLogin} setIsLogin={setIsLogin}/>

      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/login' element={<Login setIsLogin={setIsLogin}/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
