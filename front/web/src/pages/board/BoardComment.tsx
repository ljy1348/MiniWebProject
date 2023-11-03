import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../css/board/BoardComment.css";
import UserService from "../../services/auth/UserService";
import BoardService from "../../services/BoardService";
import IBoardComment from "../../types/board/IBoardComment";

function BoardComment({ bid, boardWriter }:{bid:number, boardWriter:string}) {

  // 대댓글 저장용 함수
  const initReCommnet = { bid:0, commentContent: "", isReComment:false, parentBcid:0, parentWriter:"" };

  // 댓글 목록 초기화용 함수
  const initComment = [{ bcid: 0, commentWriter: "", commentContent: "", isReComment:false, parentBcid:0 }];

  // 댓글 정보 저장 함수
  const [comment, setComment] = useState<Array<IBoardComment>>(initComment);

  // 내가 쓴 글/댓글 인지 확인하기 위한 함수
  const [username, setUsername] = useState("");

  // 댓글 클릭 했을 때 수정창을 띄우기 위해 댓글 인덱스를 저장하는 함수
  const [bcidx, setbcidx] = useState(-1);

  // 댓글 수정용 객체
  const [commentEdit, setCommentEdit] = useState<IBoardComment>({
    commentContent: "",
    commentWriter:"",
    bcid: 0,
    bid : 0,
    isReComment : false,
    parentBcid:0,
    parentWriter:""
  });

  // 댓글 작성용 객체
  const [addComment, setAddComment] = useState({bid:bid,commentContent:"",isReComment:false})
  const [reder, setRender] = useState(0);
  const [rebcidx, setRebcidx] = useState(-1);
  const [reComment, setRecomment] = useState<IBoardComment>(initReCommnet);

  // 댓글 목록 불러오기 및 댓글과 토큰 아이디 일치하면 수정/삭제 버튼 표시하기
  useEffect(() => {
    
      BoardService.boardCommendGet(bid)
      .then((response) => {
        setComment(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    if (localStorage.getItem("token") !== null) {
      const username = UserService.getUserName;
      setUsername(username);
      }
  }, [reder]);

  // 댓글 수정 눌렸을 때 댓글 수정창 뜨게 하기
  const onClickEdit = (e:any) => {
    setbcidx(e.target.value);
    setCommentEdit(comment[e.target.value]);
  };

  // 댓글 삭제
  const onClickDelete = (e:any) => {
    BoardService.boardCommentDelete(e.target.value)
    .then(response => {setRender(reder+1)})
    .catch(error =>{});
};

// 댓글 수정창 바인딩 함수
  const onChangeComment = (e:any) => {
    setCommentEdit({ ...commentEdit, commentContent: e.target.value });
  };

  // 댓글 수정 완료
  const onClickSave = () => {
    BoardService.boardCommentEdit(commentEdit)
    .then(response=>{setRender(reder+1); setbcidx(-1);})
    .catch(error=>{console.log(error)});
  };

  // 대댓글 작성 화면 호출
  const onClickComment = (bcid:number, parentBcid:number, commentWriter:any) =>{
    if (rebcidx === bcid) {
      setRebcidx(-1);
      setRecomment(initReCommnet);
    }
    else {
      setRebcidx(bcid);
      setRecomment({...reComment, bid:bid,parentBcid:parentBcid, isReComment:true, parentWriter:commentWriter})
      setRender(reder+1);
    }
  };

  // 대댓글 바인딩 함수
  const onChangeReComment= (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setRecomment({...reComment, commentContent:e.target.value});
  }

  // 대댓글 서브밋 함수
  const onSubmitReComment = () => {
    BoardService.boardCommentAdd(reComment, "")
    .then(response=>{setRender(reder+1); setRebcidx(-1); setRecomment(initReCommnet)})
    .catch(error=>{console.log(error)});
  }

  // 댓글 등록창 바인딩 함수
  const onChangeAddComment = (e:React.ChangeEvent<HTMLTextAreaElement>) =>{
    setAddComment({...addComment, commentContent:e.target.value});
  };

  // 댓글 등록 서브밋
  const onSubmitAddComment = () =>{
    BoardService.boardCommentAdd(addComment, boardWriter)
    .then(response=>{setRender(reder+1); setAddComment({...addComment, commentContent:""})})
    .catch(error=>{console.log(error)});
  };

  const commentWriter = (idx:number, bcid:number) => {
    if ( comment[idx].commentWriter == UserService.getUserName()) {
      return <><button value={idx} onClick={onClickEdit}>
      수정
    </button>
    <button value={bcid} onClick={onClickDelete}>
      삭제
    </button></>
    }
    if (UserService.getUserRole() == "ADMIN") {
      return <><button value={bcid} onClick={onClickDelete}>
      삭제
    </button></>
    }
    return <></>
  }

  return (
    <>
    <tr>
      {/* 댓글 목록 시작 */}
    <th className="text-start" colSpan={2}>
      {comment.map((val, idx) => {
        return (
          <table
            key={val.bcid}
            style={{
              tableLayout: "fixed",
              width: "100%",
              borderBottom: "1px solid #000",
            }}
          >
            <tbody>
              <tr>
              {/* 댓글 작성자 */}
              {val.isReComment && <td style={{width:"20px"}}>┖</td>}
                <td style={{ width: "100px", wordWrap: "break-word" }}>
                  {val.commentWriter}
                </td>
                {bcidx != idx ? (
                  // 댓글 표시용
                  <>
                  {/* 댓글 작성자, 내용 표시 시작*/}
                    <td style={{ width: "80%" }}>
                      {/* 댓글 누르면 해당 댓글에 대댓글 다는 창 추가 */}
                      <div
                      onClick={()=>onClickComment(val.bcid, val.parentBcid, val.commentWriter)}
                        style={{
                          width: "100%",
                          maxWidth: "80%",
                          wordWrap: "break-word",
                        }}
                      >
                        : <span>{val.commentContent}</span>
                      </div>
                    </td>
                    {/* 댓글 작성자, 내용 표시 끝 */}
                    {/* 글쓴이 == 유저 라면 수정/삭제 버튼 표시 시작 */}
                    <td style={{ width: "100px" }}>
                      {/* {username === val.commentWriter && (
                        <>
                          <button value={idx} onClick={onClickEdit}>
                            수정
                          </button>
                          <button value={val.bcid} onClick={onClickDelete}>
                            삭제
                          </button>
                        </>
                      )} */}
                      {
                        commentWriter(idx,val.bcid)
                      }
                    </td>
                      {/* 글쓴이 == 유저 라면 수정/삭제 버튼 표시 끝 */}
                  </>
                ) : (
                  // 댓글 수정 시작
                  <>
                    <td>
                      <textarea
                        style={{ width: "100%" }}
                        value={commentEdit.commentContent}
                        onChange={onChangeComment}
                      ></textarea>
                    </td>
                    <td style={{ width: "100px" }}>
                      <button onClick={onClickSave}>완료</button>
                    </td>
                  </>
                  // 댓글 수정 완료
                )}
              </tr>
              {/* 대댓글 등록창 */}
              {rebcidx === val.bcid&&<tr><td colSpan={5} className='text-align'><textarea className="me-3" 
              onChange={onChangeReComment} value={reComment.commentContent}>
                </textarea><button onClick={onSubmitReComment}>등록</button></td></tr>}
            </tbody>
          </table>
        );
      })}
    </th>
    </tr>
        <tr>
        <td className='text-align' colSpan={2}>
          <textarea className='me-3' onChange={onChangeAddComment} value={addComment.commentContent}></textarea>
          <button type="submit" onClick={onSubmitAddComment}>등록</button>
          </td>
        </tr>
        </>
  );
}

export default BoardComment;