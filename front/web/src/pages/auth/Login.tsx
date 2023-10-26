import React,{useState, useEffect} from "react";
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import IUser from './../../types/auth/IUser';

function Login({setIsLogin}:{setIsLogin:React.Dispatch<React.SetStateAction<boolean>>}) {
  // 유저 객체
    const [user, setUser] = useState<IUser>({username:"",password:""});
    // 네비
    const navi = useNavigate();

    // 유저 객체 와 input 바인딩
    const onchangeInput = (event : React.ChangeEvent<HTMLInputElement>) => {
      setUser({...user, [event.target.name]:event.target.value});
    }

    // 로그인 클릭 함수
    const onSubmitLogin = (event: React.FormEvent<HTMLFormElement>) => {
      // 새로고침안함
        event.preventDefault();

        // 로그인 정보 보내기 성공하면 리턴받은 토큰 저장 후 isLogin true로 변경 후 뒤로가기
        axios.post('/api/login', user)
        .then((response) => {
                const token = response.headers['authorization'];
                localStorage.setItem("token",token);
                console.log(response);
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace('-', '+').replace('_', '/');
                const decod = JSON.parse(window.atob(base64));
                localStorage.setItem('exp',decod.exp);
                localStorage.setItem('name',decod.sub);
                setIsLogin(true);
                navi(-1);
            })
        .catch(error => {console.log(error)});
        
    }

    // 토큰이 없거나 만료가 되었다면 뒤로가기 함수 근데 이게 로그인에 왜 있냐
    useEffect(()=>{
        // const now:number = Date.now() / 1000;
        // const exp = localStorage.getItem('exp');
        // if (now > (exp as unknown as number) && localStorage.getItem('token') != null) {
        //     navi(-1);
        // }
    },[])


  return (
    <div className="container">
      {/* 폼시작 */}
        <form onSubmit={onSubmitLogin}>
          {/* id 입력 */}
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
      {/* 비밀번호 입력 */}
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
      {/* 로그인 버튼 */}
      <button type="submit" className="btn btn-outline-primary m-1">로그인</button>
          </form>
    </div>
  );
}

export default Login;
