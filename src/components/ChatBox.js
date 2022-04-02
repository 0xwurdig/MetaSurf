import React from 'react';

const msg = ['hey', 'welcome', 'Metasurf', 'Devfolio', 'nice app!'];
msg.map(x => {
  console.log('x', x);
})

const ChatBox = () => {
  return (
    <div className='text-[#228b22] my-1'>
      {msg.map((x) => (
        <p className='m-4 p-1 pl-4 bg-white rounded-xl'> { x } </p>
      ))}
    </div>
  )
}

export default ChatBox;