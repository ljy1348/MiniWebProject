import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import IUser from '../../types/auth/IUser';
import axios from 'axios';

function Register() {
  // 유저
    const [user, setUser] = useState<IUser>({username:"", password:"", name:""});
    // 네비
    const navi = useNavigate();

    // input 바인딩
    const onchangeInput = (event : React.ChangeEvent<HTMLInputElement>) => {
      setUser({...user, [event.target.name]:event.target.value});
    }

    // 서브밋 클릭 함수 - 회원가입 실행
    const onSubmitRegister = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(user);
        axios.post('/api/register', user)
        .then(response => {navi(-1);})
        .catch(error => {console.log(error)});
    }

  return (
    <div className="container">
      {/* 폼 시작 */}
        <form onSubmit={onSubmitRegister}>
          {/* id */}
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          ID
        </label>
        <input
          type="text"
          className="form-control"
          name="username"
          value={user.username}
          onChange={onchangeInput}
          />
      </div>
      {/* 비밀번호 */}
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          비밀번호
        </label>
        <input
          type="password"
          className="form-control"
          name="password"
          value={user.password}
          onChange={onchangeInput}
          />
      </div>
      {/* 이름 */}
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          이름
        </label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={user.name}
          onChange={onchangeInput}
          />
      </div>
      {/* 회원가입 버튼 */}
      <button type="submit" className="btn btn-outline-primary m-1">회원가입</button>
          </form>
    </div>
  );
}

export default Register