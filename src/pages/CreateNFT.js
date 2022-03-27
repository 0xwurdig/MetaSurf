import React from 'react';
import { Link } from 'react-router-dom';

import NFTForm from '../components/NFTForm'

const CreateNFT = () => {
  return (
    <div className='flex'>
      <div className="bg-[#3f3f3f] h-[100vh] w-[20vw] py-10 px-20 text-lg text-[#b5b5b5]">
          <ul>
              <li className="my-4"><Link to="/">Home</Link></li>
              <li className="my-4"><Link to="/dashboard">Dashboard</Link></li>
              <li className="my-4"><Link to="/createStream">Stream</Link></li>
          </ul>
      </div>
      <div className="p-[3vw] w-full">
        <h1 className='text-3xl font-medium mb-4'>NFT Rewards</h1>
        <NFTForm />
      </div>
    </div>
  )
}

export default CreateNFT;