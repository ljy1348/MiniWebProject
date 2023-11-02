import React, { useEffect, useState } from 'react';
import '../../css/Chat.css';
import SockJs from "sockjs-client";
import * as StompJs from "@stomp/stompjs";
import UserService from '../../services/auth/UserService';
import IChat from '../../types/other/IChat';


function Chat({isLogin}:{isLogin:boolean}) {
    const [chat, setChat] = useState<Array<IChat>>([]);

    const [input, setInput] = useState("");
    const [stompClient, setStompClient] = useState(new StompJs.Client({
      // SockJS 경로를 brokerURL에 지정
      brokerURL: 'ws://59.28.90.58:8080/chat/websocket',
      connectHeaders: {
        login: 'ecab7bc0-2a34-0ad6-dada-0a7a074c30fb-53',
      },
      debug: function (str) {
        // console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    }));


    
    const onChangeInput = (e:any) =>{
      setInput(e.target.value);
    }

    let object:IChat = {message:"", chatName:""};

    // 랜덤한 문자열 생성 함수
    function generateRandomString(length:number) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
      }
      
      return result;
    }


    const wsConnect = () => {
      // 웹소켓 구독 - 웹소켓에 데이터 올라오면 받아오기
      stompClient.subscribe('/topic/messages', (message) => {
        const string = new TextDecoder('utf-8').decode(message.binaryBody);
        object = JSON.parse(string);
        const message2 = object.message;
        if (chat.length > 50) chat.shift();
        console.log(chat); 
        setChat((prevChat) => { 
          if (prevChat.length > 10) prevChat.shift();
          return [...prevChat, object]});
        // setChat([...chat, object]);
        console.log(object.chatName+' : '+string);
      });
    };
    
    // 웹소켓이 연결되면 실행
    stompClient.onConnect = wsConnect;
    stompClient.activate();

    const [chatName, setChatName] = useState<any>("");

    function scrollToBottom() {
      const chatContainer = document.querySelector('.chat');
      if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    useEffect(()=>{scrollToBottom()},[chat])
    
    useEffect(()=>{
      if (isLogin) setChatName(UserService.getUserName());
      else {
        if (localStorage.getItem('chatName') == null) {
          localStorage.setItem('chatName', generateRandomString(7));
          setChatName(localStorage.getItem('chatName'));
        } else {setChatName(localStorage.getItem('chatName'))}
      }
    },[isLogin])

    const onClickEvent = () => {

        stompClient.publish({
          destination: '/app/chat',
          body: JSON.stringify({ message: input, chatName : chatName }),
        });
      // }
      setInput("");
    };
    

  return (
    <div className='container'>
        <div className='chat container mt-5' >
          {chat.map((val, idx)=>{
            if (val.chatName == localStorage.getItem('chatName')) {
              console.log("chatname이 같음")
              return  (
                <div className='text-end' style={{ whiteSpace: "pre-wrap"}} key={idx}><p >{val.chatName} : {val.message}</p></div>
                )
            }
                if (localStorage.getItem('token') != null) {
                  if (val.chatName == UserService.getUserName()) {

                    return (
                      <div className='text-end' style={{ whiteSpace: "pre-wrap"}} key={idx}><p >{val.chatName} : {val.message}</p></div>
                      )
                    }
                }
            return (
            <div className='text-start' style={{ whiteSpace: "pre-wrap"}} key={idx}><p >{val.chatName} : {val.message}</p></div>
            )
          })}
        </div>
          <br/>
        <div className='text-input'>
          <textarea className='chatInput' onChange={onChangeInput} value={input}></textarea>
          &nbsp;&nbsp;
          <button onClick={onClickEvent} className='submitButton'>전송</button>
        </div>
    </div>
  )
}

export default Chat