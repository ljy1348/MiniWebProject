import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/css/board/BoardWrite.css';
import UserService from '../../services/auth/UserService';
import BoardService from '../../services/BoardService';
import FileService from '../../services/FileService';

function BoardWrite({setIsLogin} : {setIsLogin:React.Dispatch<React.SetStateAction<boolean>>}) {

  const [board, setBoard] = useState({title:"", content:"", isFile:false});
  const [fileList, setFileList] = useState<File[] | null>([]);
  const [fileCount, setFileCount] = useState<number[]>([0]);
  const {bid} = useParams();
  const navi = useNavigate();


    // page 로딩 될 때 로그인 확인(토큰 만료 확인)
    useEffect(()=>{
      if (!UserService.isTokenExp()) {
        setIsLogin(false);
        navi("/login")
      }
    },[]);

    // // 이미지 붙여넣기
    // function MyCustomUploadAdapterPlugin(editor:any) {
    //   editor.plugins.get("FileRepository").createUploadAdapter = (loader:any) => {
    //     return {
    //       upload: async () => {
    //         const file = await loader.file;
    //         const reader = new FileReader();
    //         const fileType:string = file.type;
    //         return new Promise((resolve, reject) => {
    //           reader.addEventListener("load", () => {
    //             resolve({ default: reader.result });
    //           });
    //           reader.addEventListener("error", reject);
    //           reader.readAsDataURL(file);
    //         });
    //       },
    //     };
    //   };
    // }

    // 이미지 업로드 함수
    function MyCustomUploadAdapterPlugin(editor: any) {
      editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
        return {
          upload: () => {
            return new Promise((resolve, reject) => {
              loader.file
                .then((file: any) => {
                  const formData = new FormData();
                  formData.append('file', file);
                  formData.append('writer', UserService.getUserName());
                  
                  // 서버에 파일을 업로드
                  return FileService.add(formData);
                })
                .then((response: any) => {
                  console.log(response);
                  resolve({ default: response.data });  // 성공 시 resolve 호출
                })
                .catch((error: Error) => {
                  console.log(error);
                  reject(error);  // 실패 시 reject 호출
                });
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
          <input type="file" name="filename" onChange={onChangeFile}></input>
          <button type='submit' onClick={onClickSubmit}>저장</button>
    </div>
  )
}

export default BoardWrite