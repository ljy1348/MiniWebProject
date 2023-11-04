import React, { useEffect, useState } from 'react'
import '../../../assets/css/auth.css';
import IBoardList from '../../../types/board/IBoardList';
import IBoardComment from '../../../types/board/IBoardComment';
import UserService from '../../../services/auth/UserService';
import BoardService from '../../../services/BoardService';
import { Link } from 'react-router-dom';

function UserInfo() {

  // 최신글 리스트
  const[recentBoard, setRecentBoard] = useState<Array<IBoardList>>([]);
  // 최신댓글 리스트
  const[recentComment, setRecentComment] = useState<Array<IBoardComment>>([]);

  // 화면이 실행할때 실행
  useEffect(()=>{
    const username = UserService.getUserName();

    BoardService.getBoardByUser(username)
    .then((response:any)=>{
      const {boardList, comment} = response.data;
      console.log(response);
      setRecentBoard(boardList);
      setRecentComment(comment);
    })
    .catch((e:Error)=>{console.log(e)})

  },[]);


  return (
    <div className='container'>

    <div className='recent-list mt-5'>

    {/* 최신글 시작*/}
    <div className='recentBoard container'>
      <h2>최근 글</h2>
      {/* 최신글 리스트 */}
      <table className='table table-hover'>
        <thead>
        <tr>
          <td>
          제목
          </td>
        </tr>
        </thead>
        <tbody>
          {recentBoard && recentBoard.map((val, idx)=>{
            return (
              <tr key={idx}><td><Link to={"/board/"+val.bid} className='Link'>
                {val.title}
                </Link></td></tr>
            )
          })}
        </tbody>

      </table>
      
    </div>
    {/* 최신글 끝 */}
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    {/* 최신 댓글 시작*/}
    <div className='recentComment container'>
    <h2>최근 댓글</h2>
    <table className='table table-hover'>
        <thead>
        <tr>
          <td>
          내용
          </td>
        </tr>
        </thead>
        <tbody>
        {recentComment && recentComment.map((val, idx)=>{
            return (
              <tr key={idx}>
                <td>
                <Link to={"/board/"+val.bid} className='Link'>
                {val.commentContent}
                </Link>
                </td>
                </tr>
            )
          })}
        </tbody>

      </table>
    </div>
    {/* 최신 댓글 끝*/}
    </div>

    </div>
  )
}

export default UserInfo