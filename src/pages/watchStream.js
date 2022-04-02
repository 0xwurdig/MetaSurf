import React, { useEffect, useState, useCallback } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { MaticBlack, MaticWhite } from '../components/svg';
import ChatBox from '../components/ChatBox';

import videojs from "video.js";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';

// import "videojs-contrib-hls";
// import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import "video.js/dist/video-js.min.css";
const WatchStream = () => {
    const navigate = useNavigate();
    const { account } = useWeb3React();
    const params = useParams()
    const id = params.id
    const [videoEl, setVideoEl] = useState(null);
    const [activeViewers, setActiveViewers] = useState([]);
    const [playbackId, setPlaybackId] = useState(null);
    const [title, setTitle] = useState("Title...")
    const [desc, setDesc] = useState("Description...")
    const onVideo = useCallback((el) => {
        setVideoEl(el);
    }, []);
    useEffect(() => {
        getData()
    }, [])
    const getData = async () => {
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);
        // console.log("Document data:", docSnap.data().playbackId);
        setPlaybackId(docSnap.data().playbackId)
        setTitle(docSnap.data().title)
        setDesc(docSnap.data().desc)
        await updateDoc(docRef, {
            viewers: arrayUnion(account)
        });
        onSnapshot(doc(db, "users", id), (doc) => {
            setActiveViewers(doc.data().viewers)
        });
    }
    useEffect(() => {
        if (videoEl == null) return;
        const player = videojs(videoEl, {
            autoplay: true,
            controls: true,
            liveui: true,
            fluid: true,
            textTrackSettings: false,
            sources: [
                {
                    src: `https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`,
                },
            ],
        });

        player.hlsQualitySelector();

        player.on("error", () => {
            player.src(`https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`);
        });

    }, [playbackId]);

    const leaveStream = async () => {
        const docRef = doc(db, "users", id);
        await updateDoc(docRef, {
            viewers: arrayRemove(account)
        }).then(() => navigate('/'));

    }
    return (
        <div className="flex ">
            <div className="bg-[#3f3f3f] h-auto min-h-[100vh] w-auto py-10 px-20 text-lg text-[#b5b5b5]">
                <ul>
                    <li className="my-4"><div onClick={() => navigate('/')}>Home</div></li>
                    <li className="my-4"><div onClick={() => navigate('/dashboard')}>Dashboard</div></li>
                    <li className="my-4"><div onClick={() => navigate('/createStream')}>Stream</div></li>
                    <li className="my-4">Video NFT</li>
                </ul>
            </div>
            <div className="p-[5vw]">
                <div className="w-[70vw]  min-w-[1100px] max-h-[1000px] overflow-clip">
                    <video
                        id="video"
                        ref={onVideo}
                        className="h-full w-full video-js vjs-theme-city"
                        controls
                        playsInline
                    />
                </div>
                <div className="flex justify-between min-h-[300px]">
                    <div>
                        <h1 className="text-3xl font-medium my-12 mx-16">{title}</h1>
                        <p className="text-[#b5b5b5] w-[40vw] min-h[150px] mx-16">{desc}</p>

                    </div>
                    <div>
                        <div className="flex justify-between h-auto w-auto bg-[#3f3f3f] px-4 py-3 items-center my-10 rounded-xl">
                            <MaticWhite />
                            <div className="text-4xl font-light text-white tracking-wider ml-5">{activeViewers.length}</div>
                        </div>

                    </div>
                </div>
                <div className='flex justify-between bg-[#3f3f3f] text-white rounded-2xl p-4'>
                  <div className=" w-[70%] grid grid-cols-7 gap-4">
                      {/* TODO loop through and pass viewers details dynamically */}
                      <div className='w-14 h-14 bg-white rounded-full'>
                        <img
                          alt=""
                          src="https://www.larvalabs.com/public/images/cryptopunks/punk1385.png"
                          className="object-contain w-14 h-14"
                        />
                      </div>
                      <div className='w-14 h-14 bg-white rounded-full'>
                        <img
                          alt=""
                          src="https://www.larvalabs.com/public/images/cryptopunks/punk1385.png"
                          className="object-contain w-14 h-14"
                        />
                      </div>
                      <div className='w-14 h-14 bg-white rounded-full'>
                        <img
                          alt=""
                          src="https://www.larvalabs.com/public/images/cryptopunks/punk1385.png"
                          className="object-contain w-14 h-14"
                        />
                      </div>
                  </div>
                  <div className='w-[30%]'>
                    <ChatBox />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                    <button className="bg-[#B11414] h-[50px] w-[25%] rounded-2xl my-8 text-white tracking-widest text-xl" onClick={() => leaveStream()}>
                        Leave
                    </button>
                    {/* <div className="flex justify-between h-auto w-auto bg-[#D3D3D3] px-4 py-3 items-center rounded-xl">
                        <MaticBlack />
                        <div className='w-[30%]'>
                            <input type="text" pattern="[0-9]*" className="text-lg text-[#848484] bg-transparent w-full outline-none border-b-black border-b-2" />
                        </div>
                        <button className="bg-[#3f3f3f] h-[74px] w-[40%] -my-3 -mr-4 rounded-2xl text-white text-xl tracking-widest">
                            TIP
                        </button>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default WatchStream;