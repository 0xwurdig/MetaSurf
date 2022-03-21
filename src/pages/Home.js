import React from 'react'
import { StreamTiles } from '../components/stream';
import { VideoTiles } from '../components/video';



const Home = () => {
    return (
        <div className="flex">
            <div className="bg-[#3f3f3f] h-auto w-[20vw] py-10 px-20 text-lg text-white">
                <ul>
                    <li className="my-4">Home</li>
                    <li className="my-4">Dashboard</li>
                    <li className="my-4">Stream</li>
                    <li className="my-4">Video NFT</li>
                </ul>
            </div>
            <div className="p-[5vw]">
                <h1 className="text-4xl font-semibold mb-10 ">Live Streams...</h1>
                <div className="flex pb-10 w-[70vw] overflow-x-scroll">
                    <StreamTiles />
                    <StreamTiles />
                    <StreamTiles />
                    <StreamTiles />
                </div>
                <h1 className="text-4xl font-semibold my-10 ">Videos...</h1>
                <div className="flex pb-10 w-[70vw]">
                    <VideoTiles />
                    <VideoTiles />
                    <VideoTiles />
                </div>
                <div className="flex pb-10 w-[70vw]">
                    <VideoTiles />
                    <VideoTiles />
                    <VideoTiles />
                </div>
            </div>
        </div>

    );
};

export default Home;