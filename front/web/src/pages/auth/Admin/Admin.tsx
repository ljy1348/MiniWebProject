import { Pagination, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import IBoardList from '../../../types/board/IBoardList';
import BoardService from '../../../services/BoardService';
import AdminService from '../../../services/auth/AdminService';
import UserService from '../../../services/auth/UserService';

function Admin() {
  const initBoardList:IBoardList[] = [{bid: 0,
    title: "",
    writer: "",
    insertTime: "",
    vote: 0,
    isFile: false,
    isPin: false,
    views:0,
    commentCount: 0,
  imgFid : 0}]

const[boardList, setBoardList] = useState<Array<IBoardList>>([]);
const[page, setPage] = useState(1);
const[maxPage, setMaxPage] = useState(1);
const navi = useNavigate();
const[pageSize, setPageSize] = useState(10);
const[render, setRender] = useState(0);

useEffect(()=>{
  const role = UserService.getUserRole();
  if (role != 'ADMIN' && role != 'SUPER_ADMIN') {
    navi("/");
  }

  AdminService.getAll(page-1,pageSize)
  .then((response:any)=>{
    console.log(response);
    const {boardList, totalPages} = response.data
    setBoardList(boardList);
    setMaxPage(totalPages);
  })
  .catch(error=>{console.log(error)})
},[render,page]);

const onChangePage = (e:any, value:number) => {
  setPage(value);
}

const onClickRestore = (bid:number) =>{
  BoardService.restoreBoard(bid)
  .then(()=>{setRender(render+1)})
  .catch((e:Error)=>{console.log(e)})
}


return (
<div className='container'>
    <h1>삭제 된 게시글</h1>

    <table className="table table-hover">
<thead>
<tr>
  <th scope="col" className='bid'>번호</th>
  <th scope="col" className='btitle'>제목</th>
  <th scope="col" className='writer'>작성자</th>
  <th scope="col" className='insertTime'>삭제 복원</th>
</tr>
</thead>
<tbody>
{boardList && boardList.map((val, idx)=>{
    let time = val.insertTime;
    time = time.substring(5,10);
  return (
    <tr key={idx}>
    <td className='bid'>{val.bid}</td>
    <td className='btitle text-start'><Link to={"/board/"+val.bid} className='titleLink'><span className='titleSpan'>{val.title}</span></Link> <span className='commentCount'>{val.commentCount}</span>
    {val.imgFid > 0 &&
    // <span className='listImg'><img src={'http://59.28.90.58:3000/api/img/'+val.imgFid} width={"30px"}></img></span>} // 사진 미리보기
    <span><img src='/assets/img/picture.PNG'></img></span>}
    {val.isFile &&
    <span><img src='/assets/img/file.PNG'></img></span>}
    </td> 
    <td className='writer'>{val.writer}</td>
    <td className='insertTime'><button onClick={()=>onClickRestore(val.bid)}>복원</button></td>
  </tr>
  );
  })
}
</tbody>

</table>
<Link to={"/board/write"}><button className="btn btn-outline-secondary">글쓰기</button></Link>
<div className='m-3'><Stack alignItems="center"><Pagination count={maxPage} color="primary" page={page} 
siblingCount={1} boundaryCount={1}
showFirstButton showLastButton onChange={onChangePage}/></Stack></div>
</div>
)
}

export default Admin