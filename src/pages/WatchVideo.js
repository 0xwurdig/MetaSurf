import React from 'react'
import { Link } from 'react-router-dom';
import { MaticBlack, MaticWhite } from '../components/svg';
const WatchVideo = () => {
    return (
        <div className="flex ">
            <div className="bg-[#3f3f3f] h-auto min-h-[100vh] w-auto py-10 px-20 text-lg text-[#b5b5b5]">
                <ul>
                    <li className="my-4"><Link to="/">Home</Link></li>
                    <li className="my-4"><Link to="dashboard">Dashboard</Link></li>
                    <li className="my-4"><Link to="createStream">Stream</Link></li>
                    <li className="my-4">Video NFT</li>
                </ul>
            </div>
            <div className="p-[5vw]">
                <div className="w-[70vw]"><img alt="" src="/newYork.jpg" /></div>
                <div className="flex">
                    <div>
                        <h1 className="text-3xl font-medium my-12 mx-16">My new travel in New York!</h1>
                        <p className="text-[#b5b5b5] w-[40vw] mx-16">We zijn jong, we zijn oud. We zijn groot, we zijn klein. We zijn jouw grootste bron van inspiratie en je grootste provocateur. We zijn veel dingen, maar we zijn niet gemiddeld. De waarheid is dat mensen niet echt om merken geven. Daarom moeten merken relevant zijn om de tijd van mensen te verdienen. Wij zorgen er voor dat jouw merk relevant wordt.</p>
                        <button className="bg-[#B11414] h-[50px] w-[25%] rounded-2xl my-8 text-white tracking-widest text-xl">
                            Leave
                        </button>
                    </div>
                    <div>
                        <div className="flex justify-between h-auto w-auto bg-[#3f3f3f] px-4 py-3 items-center my-10 rounded-xl">
                            <MaticWhite />
                            <div className="text-4xl font-light text-white tracking-wider ml-5">20000</div>
                        </div>
                        <div className="flex justify-between h-auto w-auto bg-[#D3D3D3] px-4 py-3 items-center my-36 rounded-xl">
                            <MaticBlack />
                            <div className='w-[30%]'>
                                <input type="text" pattern="[0-9]*" className="text-lg text-[#848484] bg-transparent w-full outline-none border-b-black border-b-2" />
                            </div>
                            <button className="bg-[#3f3f3f] h-[74px] w-[40%] -my-3 -mr-4 rounded-2xl text-white text-xl tracking-widest">
                                TIP
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchVideo;