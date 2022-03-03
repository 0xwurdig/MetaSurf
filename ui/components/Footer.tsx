import React from 'react';

import type { NextPage } from 'next';
import Image from 'next/image';

import ellipse from '../public/images/ellipse.svg';


const Footer: NextPage = () => {
  return (
    <footer className='mt-8'>
      <div className='flex col-span-2 self-center'>
          <p className='text-2xl xl:text-4xl'> 32:03 </p>
          <p className='ml-3 self-center'>
            <Image src={ellipse} alt="caret left" width={8} height={8} className='col-span-1' />
            {' '} Live
          </p>
        </div>
    </footer>
  )
}

export default Footer;