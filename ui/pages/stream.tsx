// import React from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';

import Nav from '../components/Nav';
import Footer from '../components/Footer';

import caretLeft from '../public/images/caret-left.svg';
import profileIcon from '../public/images/profile-icon.svg';
import searchIcon from '../public/images/search-icon.svg';
import ellipse from '../public/images/ellipse.svg';

const Stream: NextPage = () => {
  return (
    <div className='container bg-white h-screen w-screen flex flex-col p-6'>
      <Nav />
      <main className='grid grid-cols-12 gap-5 h-[50rem]'>
        <div className='col-span-4 rounded-2xl border border-gray-200 '>
        </div>
        <div className='col-span-8'>
          <iframe src='https://www.youtube.com/embed/cWDJoK8zw58' className='rounded-2xl w-full h-full'/>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Stream;