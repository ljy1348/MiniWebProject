import React, { useEffect, useState } from 'react';
import '../../assets/css/Chat.css';
import SockJs from "sockjs-client";
import * as StompJs from "@stomp/stompjs";
import UserService from '../../services/auth/UserService';
import IChat from '../../types/other/IChat';
import axios from 'axios';


function Chat({isLogin}:{isLogin:boolean}) {
    const [chat, setChat] = useState<Array<String>>([""]);

    const [input, setInput] = useState("");
    const [stompClient, setStompClient] = useState(new StompJs.Client({
      // SockJS 경로를 brokerURL에 지정
      brokerURL: 'ws://59.28.90.58:8080/chat/websocket',
      connectHeaders: {
        // login: 'ecab7bc0-2a34-0ad6-dada-0a7a074c30fb-53',
      },
      debug: function (str) {
        console.log(str);
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

    // 웹소켓이 연결되면 실행
    
    const [chatName, setChatName] = useState<any>("");

    // 채팅목록 스크롤 맨밑고정
    function scrollToBottom() {
      const chatContainer = document.querySelector('.chat');
      if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    useEffect(()=>{
      axios.get("http://59.28.90.58:8080/api/chat")
      .then((response:any)=>{
        console.log(response);
      setChat(response.data)})
      .catch((e:Error)=>{console.log(e)})
    },[])
    
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
    
    useEffect(() => {
      let subscription:any;
    
      const wsConnect = () => {
        // 웹소켓 구독
        subscription = stompClient.subscribe('/topic/messages', (message) => {
          // 메시지 수신 로직...
          const string = new TextDecoder('utf-8').decode(message.binaryBody);
          setChat((prevChat) => { 
            return [...prevChat, string]});
        });
      };
    
      if (!stompClient.active) {
        stompClient.onConnect = wsConnect;
        stompClient.activate();
      }


    
      // 구독 해제 로직을 클린업 함수로 반환
      return () => {
        subscription && subscription.unsubscribe();
        stompClient.deactivate();
      };
    }, [stompClient]);

    const onClickEvent = () => {

        stompClient.publish({
          destination: '/app/chat',
          body: JSON.stringify({ message: input, chatName : chatName }),
        });
      // }
      setInput("");
    };
    
  function isValidJson(text: string): boolean {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

  return (
    <div className='container chatPage'>
        <div className='chat container mt-5' >
          {chat&&chat.map((val, idx)=>{
            if (typeof val === 'string' && isValidJson(val)) {
              object = JSON.parse(val);
            }
            if (object.chatName == localStorage.getItem('chatName') || object.chatName == localStorage.getItem('lastUsername')) {
              return  (
                <div className='text-end' style={{ whiteSpace: "pre-wrap"}} key={idx}><p >{object.chatName} : {object.message}</p></div>
                )
            }
                if (localStorage.getItem('token') != null) {
                  if (object.chatName == UserService.getUserName()) {
                    return (
                      <div className='text-end' style={{ whiteSpace: "pre-wrap"}} key={idx}><p >{object.chatName} : {object.message}</p></div>
                      )
                    }
                }
            return (
            <div className='text-start' style={{ whiteSpace: "pre-wrap"}} key={idx}><p >{object.chatName} : {object.message}</p></div>
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