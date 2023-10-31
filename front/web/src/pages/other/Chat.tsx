import React, { useState } from 'react';
import '../../css/Chat.css';

function Chat() {
    const [chat, setChat] = useState<Array<string>>([]);

    

  return (
    <div className='container'>
        {chat && <div className='chat'>

        </div>}
    </div>
  )
}

export default Chat