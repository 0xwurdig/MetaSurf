import React, { useState, useEffect, useCallback } from 'react'
import { db, storage } from '../firebase';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { Link } from 'react-router-dom';
import { MaticBlack } from '../components/svg';
import videojs from "video.js";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import yourContract from "../abi/yourContract.json"
// import "videojs-contrib-hls";
// import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import "video.js/dist/video-js.min.css";
const CreateStream = () => {
    const { account } = useWeb3React();
    // const [hlsUrl, setHlsUrl] = useState("");
    const [playbackId, setPlaybackId] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [streamId, setStreamId] = useState("");
    const [streamKey, setStreamKey] = useState("--- --- ---");
    const [videoEl, setVideoEl] = useState(null);
    const [thumbNail, setThumbNail] = useState("");
    const [title, setTitle] = useState("Title...")
    const [desc, setDesc] = useState("Description...")
    const onVideo = useCallback((el) => {
        setVideoEl(el);
    }, []);
    useEffect(() => {
        checkUser()
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isActive && streamId !== "") {
                checkIfActive()
            }
        }, 3000)
        return () => clearInterval(interval)
    })
    useEffect(() => {
        if (videoEl == null) return;
        if (isActive && playbackId) {
            const player = videojs(videoEl, {
                autoplay: true,
                // controls: true,
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
        }
    }, [isActive]);
    useEffect(() => {
        contractInit();
    })
    const contractInit = async () => {
        const contract = new ethers.Contract("0x0e5196f3c26Ac63f4383c3117455655EEc92aCf9", yourContract)
        console.log(contract)

    }
    const checkUser = async () => {
        const docRef = doc(db, "users", account);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data().playbackId);
            setPlaybackId(docSnap.data().playbackId)
            setStreamKey(docSnap.data().streamKey)
            setStreamId(docSnap.data().streamId)
        } else {
            // doc.data() will be undefined in this case
            createStream()
        }
    }
    const checkIfActive = async () => {
        const response = await fetch(
            `https://livepeer.com/api/stream/${streamId}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer 9c5df1f1-236f-4149-8a1d-4c05287498d7"
            },
        }).then((response) => response.json());
        // console.log(response.isActive)
        // if (response.isActive) {
        setIsActive(response.isActive)
        // }
    }
    const createStream = async () => {
        const response = await fetch(
            "https://livepeer.com/api/stream", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer 9c5df1f1-236f-4149-8a1d-4c05287498d7"
            },
            body: JSON.stringify({
                'name': account,
                'profiles': [
                    {
                        'name': '720p',
                        'bitrate': 2000000,
                        'fps': 30,
                        'width': 1280,
                        'height': 720
                    },
                    {
                        'name': '480p',
                        'bitrate': 1000000,
                        'fps': 30,
                        'width': 854,
                        'height': 480
                    },
                    {
                        'name': '360p',
                        'bitrate': 500000,
                        'fps': 30,
                        'width': 640,
                        'height': 360
                    }
                ]
            })
        }
        ).then((response) => response.json());
        await setDoc(doc(db, "users", account), {
            streamId: response.id,
            streamKey: response.streamKey,
            playbackId: response.playbackId,
            thumbNail: "",
            title: "",
            desc: ""
        });
        setPlaybackId(response.playbackId)
        setStreamKey(response.streamKey)
        setStreamId(response.id)
    };
    const uploadThumbnail = (file) => {
        if (!file) return;
        const storageRef = ref(storage, `/files/${streamId}`);
        const uploadTask = uploadBytesResumable(storageRef, file)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const prog = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                console.log(prog)
            },
            (error) => console.log(error),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log(downloadURL);
                    setThumbNail(downloadURL)
                });
            }
        );
    }
    const thumbnailHandler = async (e) => {
        console.log("Bwahahahahahahaha")
        const file = e.target.files[0];
        uploadThumbnail(file);
        await updateDoc(doc(db, "users", account), {
            "thumbNail": thumbNail
        });
    };
    const titleDescUpdate = async () => {
        await updateDoc(doc(db, "users", account), {
            "title": title,
            "desc": desc,
        });
    }
    return (
        <div className="flex ">
            <div className="bg-[#3f3f3f] h-auto min-h-[100vh] w-auto py-10 px-20 text-lg text-[#b5b5b5]">
                <ul>
                    <li className="my-4"><Link to="/">Home</Link></li>
                    <li className="my-4"><Link to="/dashboard">Dashboard</Link></li>
                    <li className="my-4"><Link to="/createStream">Stream</Link></li>
                    <li className="my-4">Video NFT</li>
                </ul>
            </div>
            <div className="p-[5vw]">
                <div className="w-[70vw]  min-w-[1100px] max-h-[1000px] overflow-clip"><div data-vjs-player>
                    {
                        thumbNail !== "" && !isActive ? <img src={thumbNail} alt="ThumbNail" className='w-full' /> :
                            <video
                                id="video"
                                ref={onVideo}
                                className="h-full w-full video-js vjs-theme-city"
                                controls
                                playsInline
                            />
                    }
                </div>
                </div>
                <div className="flex w-[70vw] justify-between">
                    <div>
                        <textarea value={title} onChange={(e) => setTitle(e.target.value)} className="text-3xl font-medium my-12 mx-16 min-w-[600px] w-[40vw] h-auto" />

                        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="text-[#b5b5b5] min-w-[600px] w-[40vw] min-h-[150px] mx-16 outline-none " />
                        <div className="flex justify-end mx-16 min-w-[600px] w-[40vw]">
                            <button className="bg-[#b5b5b5] h-[50px] w-[25%] rounded-2xl my-8 text-white tracking-widest text-xl ali hover:bg-[#3f3f3f] hover:text-white" onClick={() => titleDescUpdate()}>
                                Save
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between h-auto w-[70%] bg-[#3f3f3f] px-5 py-3 items-center my-10 rounded-xl text-white">
                            {/* <MaticWhite /> */}
                            <label className='mr-10'>ThumbNail</label>

                            <input type="file" className="input" onChange={thumbnailHandler} />
                        </div>
                        <div className="flex justify-between h-auto w-[70%] bg-[#3f3f3f] px-5 py-3 items-center my-10 rounded-xl text-white">
                            {/* <MaticWhite /> */}
                            <label className='mr-10'>StreamKey</label>
                            <div className="text-2xl font-light text-white tracking-wider">{streamKey}</div>
                        </div>

                    </div>

                </div>
                <div className="flex justify-between items-center">
                    <button className="bg-[#B11414] h-[50px] w-[25%] rounded-2xl my-8 text-white tracking-widest text-xl">
                        Cancel
                    </button>
                    <div className="flex justify-between h-auto w-auto bg-[#D3D3D3] px-4 py-3 items-center my-8 rounded-xl">
                        <MaticBlack />
                        <div className='w-[30%]'>
                            <input type="text" pattern="[0-9]*" className="text-lg text-[#848484] bg-transparent w-full outline-none border-b-black border-b-2" />
                        </div>
                        <button className="bg-[#3f3f3f] h-[74px] w-[40%] -my-3 -mr-4 rounded-2xl text-white text-xl tracking-widest">
                            AIRDROP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateStream;