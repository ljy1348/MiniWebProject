import React, { useEffect, useState } from 'react';
import '../../css/Chat.css';
import SockJs from "sockjs-client";
import * as StompJs from "@stomp/stompjs";


function Chat() {
    const [chat, setChat] = useState<Array<string>>([]);
    // let chat:Array<string> = [];

    const [input, setInput] = useState("");
    const [stompClient, setStompClient] = useState(new StompJs.Client({
      // SockJS 경로를 brokerURL에 지정
      brokerURL: 'ws://59.28.90.58:8080/chat/websocket',
      connectHeaders: {
        login: 'ecab7bc0-2a34-0ad6-dada-0a7a074c30fb-53',
        // passcode: 'my-passcode',
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    }));


    
    const onChangeInput = (e:React.ChangeEvent<HTMLInputElement>) =>{
      setInput(e.target.value);
    }

    
    const wsConnect = () => {
      console.log("연결됨");// 연결이 활성화되었음을 표시
      stompClient.subscribe('/topic/messages', (message) => {
        const string = new TextDecoder('utf-8').decode(message.binaryBody);
        setChat(prevChat => [...prevChat, string]);
        console.log('받은 메시지:', string);
      });
    };
    
    
    stompClient.onConnect = wsConnect;
    stompClient.activate();
    
    
    
    // useEffect(()=>{
    // },[])

    const onClickEvent = () => {
      // if (isConnected) { // 연결이 활성화되었는지 확인
        stompClient.publish({
          destination: '/app/chat',
          body: JSON.stringify({ message: input }),
        });
      // }
    
      if (chat.length > 50) {
        chat.shift();
      }
      // setChat([...chat, input]);
      setInput("");
    };
    

  return (
    <div className='container'>
        <div className='chat container'>
          {chat.map((val, idx)=>{
            return <p key={idx}>{val}</p>
          })}
        </div>
        <input type='text' className='chatInput' onChange={onChangeInput} value={input}></input>
        <button onClick={onClickEvent}>전송</button>
    </div>
  )
}

export default Chat