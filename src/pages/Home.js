import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { StreamTiles } from '../components/stream';
import { VideoTiles } from '../components/video';
import { useWeb3React } from '@web3-react/core';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';
import { SideNavBar } from '../components/sideNav';



const Home = () => {
    const [activeStreams, setActiveStreams] = useState([])
    const [videos, setVideos] = useState([]);
    const { account } = useWeb3React();
    useEffect(() => {
        getData()
        const interval = setInterval(() => {
            getActiveStreams();

        }, 5000)
        return () => clearInterval(interval)
    }, [])
    const getActiveStreams = async () => {
        const response = await fetch(
            `https://livepeer.com/api/stream?streamsonly=1&filters=[{"id": "isActive", "value": true}]`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer 9c5df1f1-236f-4149-8a1d-4c05287498d7"
            },
        }).then((response) => response.json());
        setActiveStreams(response)
        console.log(activeStreams)
    }
    const getData = async () => {
        const q = query(collection(db, "videos"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // setDetails({
            //     title: doc.data().title,
            //     streamer: doc.id
            // })
            let data = doc.data()
            setVideos(state => [...state, data])
        });
    }

    const carouselStream = activeStreams.map(function (stream, index) {
        return (
            <StreamTiles id={stream.id} key={index} />
        );
    });
    const carouselVideo = videos.map(function (video, index) {
        return (
            <VideoTiles nft={video} key={index} />
        );
    });
    return (
        <div className="flex">
            <SideNavBar />
            {
                account
                    ? <div className="p-[5vw]">
                        <h1 className="text-4xl font-semibold mb-10 ">Live Streams...</h1>
                        <div className="flex pb-10 w-[70vw] overflow-x-scroll">
                            {activeStreams.length !== 0 ? carouselStream : <h1>Nothing to show</h1>}
                        </div>
                        <h1 className="text-4xl font-semibold my-10 ">Videos...</h1>
                        <div className="flex flex-wrap pb-10 w-[70vw]">
                            {videos.length !== 0 ? carouselVideo : <h1>Nothing to show</h1>}
                        </div>

                    </div>
                    : <div className="flex w-[80vw] h-[100vh]  justify-center items-center text-4xl font-semibold text-center">
                        Please Connect your wallet <br /> to view content
                    </div>
            }

        </div>

    );
};

export default Home;