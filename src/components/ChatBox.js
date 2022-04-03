import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { useWeb3React } from '@web3-react/core'
import { query, collection, onSnapshot, addDoc, Timestamp, orderBy } from "firebase/firestore";
import TextField from './TextField';

const ChatBox = (props) => {
  const { account } = useWeb3React();
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);
  // const [showAddress, setShowAddress] = useState(false);

  const profile = "https://www.larvalabs.com/public/images/cryptopunks/punk1385.png";

  const send = async () => {
    if (message) {
      await addDoc(collection(db, props.id), {
        "address": account,
        "message": message,
        "createdAt": Timestamp.now(),
      }).then(() => setMessage(''))
    }
  }
  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const q = query(collection(db, props.id), orderBy("createdAt"))
    onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push(doc.data());
      });
      setData(messages);
    });
  }


  return (
    <div className='w-full h-full justify-between'>
      <div className='text-[#228b22] my-1 overflow-y-auto max-h-[300px]'>
        {data && data.map((x) => (
          <div className='flex m-4'>
            <div className='w-8 h-8 bg-white rounded-full mx-2'>
              <img
                alt={x.address}
                src={profile}
                className="object-contain w-[100%] h-[100%]"
              />
              {/* {showAddress &&
                <p className='p-1 px-4 bg-white rounded-xl w-fit'> 'ASDFGHJ </p>
              } */}
            </div>
            <p className='p-1 px-4 bg-white rounded-xl w-fit'> {x.message} </p>
          </div>
        ))}
      </div>
      <div className='flex justify-between'>
        <TextField
          label='Type Message'
          value={message}
          id='message'
          onChange={(e) => setMessage(e.target.value)}
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