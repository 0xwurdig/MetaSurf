import React from 'react';

const Cards = ({cardTitle, cardImg, cardValue}) => {
  return (
    <div className='max-w-sm rounded-2xl shadow-xl p-16 w-[500px] h-[200px] place-items-center bg-white my-2'>
      <div className='flex place-items-center mb-4'>
        {cardImg}
        <p className='text-xl font-small'> {cardValue} </p>
      </div>
      <p className='text-3xl font-medium'> {cardTitle} </p>
    </div>
  )
}

export default Cards;