import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../../css/board/BoardWrite.css';
import UserService from '../../services/auth/UserService';
import BoardService from '../../services/BoardService';

function BoardWrite({setIsLogin} : {setIsLogin:React.Dispatch<React.SetStateAction<boolean>>}) {

  const [board, setBoard] = useState({title:"", content:"", isFile:false});
  const [fileList, setFileList] = useState<File[] | null>([]);
  const [fileCount, setFileCount] = useState<number[]>([0]);
  const navi = useNavigate();


    // page 로딩 될 때 로그인 확인(토큰 만료 확인)
    useEffect(()=>{
      if (!UserService.isTokenExp()) {
        setIsLogin(false);
        navi("/login")
      }
    },[]);

    // 이미지 붙여넣기
    function MyCustomUploadAdapterPlugin(editor:any) {
      editor.plugins.get("FileRepository").createUploadAdapter = (loader:any) => {
        return {
          upload: async () => {
            const file = await loader.file;
            const reader = new FileReader();
            const fileType:string = file.type;
            return new Promise((resolve, reject) => {
              reader.addEventListener("load", () => {
                resolve({ default: reader.result });
              });
              reader.addEventListener("error", reject);
              reader.readAsDataURL(file);
            });
          },
        };
      };
    }

    // input 파일 변할때
    const onChangeFile = (e:any) => {
      if (e.target.files[0] != null) {  
        setFileList(e.target.files);
        setBoard({...board, isFile:true})
      } else {
        setFileList(null);
        setBoard({...board, isFile:false})
      }
    };

    // 게시글 제목
    const onChangeTitle = (e:any) => {
      setBoard({...board, title:e.target.value});
    }

    // 저장 누를때
    const onClickSubmit = () => {
      const formData = new FormData;
      formData.append("board",JSON.stringify(board));
      if (fileList) {
        formData.append("file", fileList[0]);
      }
      console.log(formData.get('board'));
      BoardService.write(formData)
      .then((response)=>{
        // console.log(response);
        navi("/board")
      })
      .catch((error)=>{   
        console.log(error);
    })
  }



  return (
    <div className='container'>
      <h1>글쓰기</h1>

      <h3>제목</h3>
      <input
        type="text"
        onChange={onChangeTitle}
        value={board.title}
        name="title"
      ></input>
      <h3>내용</h3>

      <CKEditor
        config={{
          language: "ko",
          extraPlugins: [MyCustomUploadAdapterPlugin],
        }}
        editor={ClassicEditor}
        data="<p></p>"
        onReady={(editor) => {
        }}
        onChange={(event, editor:any) => {
          setBoard({...board, content:editor.getData()});
        }}
        onBlur={(event, editor) => {}}
        onFocus={(event, editor) => {}}
      />
      <br/>
          {/* <input type="file" name="filename" onChange={onChangeFile}></input> */}
          <button type='submit' onClick={onClickSubmit}>저장</button>
    </div>
  )
}

export default BoardWrite