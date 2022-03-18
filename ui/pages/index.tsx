import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image'
import styles from '../styles/Home.module.css';

import { CreateFlow } from '../components/createFlow';


const Home: NextPage = () => {
  return (
    <CreateFlow />
  )
}

export default Home;
