import React from 'react';
import { Link } from 'react-router-dom';

import NFTForm from '../components/NFTForm'
import { SideNavBar } from '../components/sideNav';

const CreateNFT = () => {
  return (
    <div className='flex'>
      <SideNavBar />
      <div className="p-[3vw] w-full">
        <h1 className='text-3xl font-medium mb-4'>NFT Rewards</h1>
        <NFTForm />
      </div>
    </div>
  )
}

export default CreateNFT;