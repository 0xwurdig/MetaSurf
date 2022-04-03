import React, { useEffect, useState } from 'react';
import TextField from './TextField';

const ChatBox = () => {
  let msg = [
    {msg: 'hey', profile: "https://www.larvalabs.com/public/images/cryptopunks/punk1385.png"},
    {msg: 'welcome', profile: "https://www.larvalabs.com/public/images/cryptopunks/punk1385.png"},
    {msg: 'Metasurf', profile: "https://www.larvalabs.com/public/images/cryptopunks/punk1385.png"},
    {msg: 'Devfolio', profile: "https://www.larvalabs.com/public/images/cryptopunks/punk1385.png"},
    {msg: 'nice app!', profile: "https://www.larvalabs.com/public/images/cryptopunks/punk1385.png"}
  ];
  const [message, setMessage] = useState("");
  const [data, setData] = useState(msg);
  const [showAddress, setShowAddress] = useState(false);

  const profile = "https://www.larvalabs.com/public/images/cryptopunks/punk1385.png";

  const send = () => {
    if(message) {
      msg.push({msg: message, profile: profile})
      setData(msg);
      setMessage('');
    }
  }


  return (
    <div className='w-full'>
        <div className='text-[#228b22] my-1'>
          {data && data.map((x) => (
            <div className='flex m-4'>
              <div className='w-8 h-8 bg-white rounded-full mx-2'>
                <img
                    alt=""
                    src={x.profile}
                    className="object-contain w-[100%] h-[100%]"
                />
                {showAddress &&
                  <p className='p-1 px-4 bg-white rounded-xl w-fit'> 'ASDFGHJ </p>
                }
            </div>
            <p className='p-1 px-4 bg-white rounded-xl w-fit'> { x.msg } </p>
            </div>
          ))}
        </div>
        <div className='flex justify-between'>
            <TextField
              label='Type Message'
              value={message}
              id='message'
              onChange={(e)=>setMessage(e.target.value)}
              width='w-[65%]'
            />
            <button
              onClick={send}
              className="bg-[#228b22] rounded-xl h-8 mt-3 w-[30%] text-white hover:bg-white hover:text-[#228b22] self-center">
                Send
            </button>
        </div>
    </div>
  )
}

export default ChatBox;