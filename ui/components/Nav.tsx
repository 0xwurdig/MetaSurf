import type { NextPage } from 'next';
import Image from 'next/image';

import caretLeft from '../public/images/caret-left.svg';
import profileIcon from '../public/images/profile-icon.svg';
import searchIcon from '../public/images/search-icon.svg';
import ellipse from '../public/images/ellipse.svg';


const Nav: NextPage = () => {
  return (
    <nav className='bg-white grid grid-cols-12 mb-3 place-content-center'>
      <div className='col-span-1 self-center'>
        <Image src={caretLeft} alt="caret left" width='24px' height='24px' />
      </div>
      <div className='flex col-span-2 self-center'>
        <p className='text-2xl xl:text-4xl'> 32:03 </p>
        <p className='ml-3 self-center'>
          <Image src={ellipse} alt="caret left" width={8} height={8} className='col-span-1' />
          {' '} Live
        </p>
      </div>
      <p className='col-span-5 text-center self-center'>Live Stream</p>
        <div className='place-content-end col-span-4 flex space-x-4'>
        <div className='self-center'>
          <Image src={profileIcon} alt="profile icon" width='24px' height='24px' />
        </div>
        <div className='self-center'>
          <Image src={searchIcon} alt="search icon" width='24px' height='24px'/>
        </div>
        <iframe src='https://www.youtube.com/embed/cWDJoK8zw58' width='125px' height='73px' className='rounded-2xl'/>
      </div>
  </nav>
  )
}

export default Nav;