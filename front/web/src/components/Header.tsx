import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import UserService from '../services/auth/UserService';

function Header({isLogin, setIsLogin, setIsAdmin, isAdmin}:
  {isLogin:boolean, isAdmin:boolean, setIsLogin:React.Dispatch<React.SetStateAction<boolean>>, setIsAdmin:React.Dispatch<React.SetStateAction<boolean>>}) {

    const navi = useNavigate();

    // 로그아웃 클릭 했을때
  const onClickLogout = () => {
    // 채팅 디자인을 위해 기록
    const lastUser = UserService.getUserName();
    localStorage.setItem('lastUsername', lastUser);
    // 토큰 정보 삭제
    localStorage.removeItem('exp');
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    // 로그인 기능 해제
    setIsLogin(false);
    setIsAdmin(false);
    navi("/");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to={'/'}>
            Home
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* 페이지 리스트 */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="navbar-brand" to={'/board'}>
                  게시판
                </Link>
              </li>
              <li className="nav-item"></li>
              <li className="nav-item">
                <Link className="navbar-brand" to={'/chat'}>
                  채팅
                </Link>
              </li>
              <li className="nav-item"></li>
              {/* 회원 정보 페이지 */}
              { isLogin &&
              <li className="nav-item">
                <Link className="navbar-brand" to={'/info'}>
                  회원 정보
                </Link>
              </li>}
              {/* 관리자 페이지 */}
              {isAdmin &&
              <li className="nav-item">
                <Link className="navbar-brand" to={'/admin'}>
                  관리자
                </Link>
              </li>
              }
              <li className="nav-item">
                <Link className="navbar-brand" to={'/pg'}>
                  결제 테스트
                </Link>
              </li>
            </ul>
            {/* 로그인/로그아웃 버튼 */}
            {!isLogin && (
              <>
                <div>
                <Link to={'/register'}>
                  <button
                    type="button"
                    className="btn btn-outline-primary m-1"
                  >
                    회원가입
                  </button>
                  </Link>
                </div>
                <div>
                <Link to={'/login'}>
                  <button
                    type="button"
                    className="btn btn-outline-primary m-1"
                  >
                    로그인
                  </button>
                  </Link>
                </div>
              </>
            )}
            {isLogin && (
              <div>
                <button
                  type="button"
                  className="btn btn-outline-primary m-1"
                  onClick={onClickLogout}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header