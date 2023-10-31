import React, { useState,useEffect } from 'react';
import '../../css/board/BoardRead.css';
import { useParams, useNavigate, renderMatches, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Route, Routes  } from 'react-router-dom';
import BoardComment from './BoardComment';
import UserService from '../../services/auth/UserService';
import BoardService from '../../services/BoardService';
import BoardWrite from './BoardWrite';
import IFileList from '../../types/board/IFileList';


function BoardRead() {

  const initBoardList = {id:0,title:"",writer:"", content:"", insertTime:"",vote:0};
  const navi = useNavigate();
  const [board, setBoard] = useState(initBoardList);
  const {bid} = useParams();
  const [fileList, setFileList] = useState<Array<IFileList>>([]);
  const [render, setRender] = useState(0);
  const [name, setName] = useState("");

  useEffect(()=>{
    BoardService.get(Number(bid))
    .then((response:any) => {
      const {board, list} = response.data;
      setBoard(board);
      setFileList(list);
      setName(UserService.getUserName());
      console.log(response);
      // const byteCharacters = atob(response.data.attachments);
      // const byteNumbers = Array.from(byteCharacters).map(char => char.charCodeAt(0));
      // const byteArray = new Uint8Array(byteNumbers);
      // const blob = new Blob([byteArray], { type: "application/octet-stream" });
      // setDownURL(URL.createObjectURL(blob));
    })
    .catch(error =>{

      console.log();
    });
  },[])


  const onClickEdit = () => {
    navi("/board/write/"+bid);
  }
  const onClickDelete = () => {
    BoardService.remove(Number(bid))
    .then((response)=>{navi(-1)})
    .catch((error)=>{console.log(error)})
  }


  return (


    <div className='container'>
      <h1 className="display-1">게시판</h1>

      <table className="table">
  <thead>
    <tr>
      <td className='title' >{board.title}</td>
      <td style={{width:'110px'}}><span>{ board.writer ==  name &&
<><button className='btn btn-sm' onClick={onClickEdit}>수정</button><button className='btn btn-sm' onClick={onClickDelete}>삭제</button></>
}</span></td>
    </tr>
  </thead>
  <tbody>
    <tr className='contentTr'>
      <th className='text-start boardContent' colSpan={2}><span dangerouslySetInnerHTML={{__html: board.content}} className='boardContent'></span></th>
    </tr>
    {
      fileList && fileList.map((data, idx)=>{
      return (  <tr key={idx}>
      <th className='text-start' colSpan={2}>첨부파일 : <a href={"http://localhost:8080/api/img/"+data.fid} download>{data.fileName}</a></th>
    </tr>)
      })
    }

      <BoardComment bid={Number(bid)} boardWriter={board.writer}></BoardComment>
      <tr><td colSpan={2}>
<button onClick={()=>{navi(-1)}}>돌아가기</button>
        </td></tr>
  </tbody>
</table>
    </div>
  )
}

export default BoardRead