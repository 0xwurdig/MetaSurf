import React, { useState } from 'react';

import TextField from './TextField';

const NFTForm = () => {
  const [name, setName] = useState("");
  const [rewardType, setRewardType] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="w-full">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <TextField
          label='Name'
          value={name}
          id='Name'
          onChange={(e)=>setName(e.target.value)}
          />
        <TextField
          label='Reward Type'
          value={rewardType}
          id='reward'
          onChange={(e)=>setRewardType(e.target.value)}
          />
        <TextField
          label='Value'
          value={value}
          id='value'
          fieldType='number'
          onChange={(e)=>setValue(e.target.value)}
        />
        <div className='mb-4 w-full'>
          <label className="block text-gray-700 text-sm font-bold mb-2" for='description'>
            Description
          </label>
          <textarea
            className="w-full border-solid border-2 border-grey-100"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-[#B11414] h-[50px] w-[25%] rounded-2xl my-8 text-white tracking-widest text-xl">
              Cancel
          </button>
          <button className="bg-[#b5b5b5] h-[50px] w-[25%] rounded-2xl my-8 text-white tracking-widest text-xl ali hover:bg-[#3f3f3f] hover:text-white">
              Save
          </button>
        </div>
      </form>
    </div>
  )
}

export default NFTForm