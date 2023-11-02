import React from 'react'
import { Link, useParams } from 'react-router-dom'

function Header({isLogin, setIsLogin, setIsAdmin, isAdmin}:{isLogin:boolean, isAdmin:boolean, setIsLogin:React.Dispatch<React.SetStateAction<boolean>>, setIsAdmin:React.Dispatch<React.SetStateAction<boolean>>}) {

  const onClickLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('exp');
    localStorage.removeItem('name');
    setIsLogin(false);
    setIsAdmin(false);
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
              { isLogin &&
              <li className="nav-item">
                <Link className="navbar-brand" to={'/info'}>
                  회원 정보
                </Link>
              </li>}
              {isAdmin &&
              <li className="nav-item">
                <Link className="navbar-brand" to={'/admin'}>
                  관리자
                </Link>
              </li>
              }
            </ul>
            {/* <button className="m-1" onClick={onClickTest}> 테스트 </button> */}
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