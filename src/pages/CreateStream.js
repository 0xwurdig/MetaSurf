import React, { useState, useEffect, useCallback } from 'react'
import { db, storage } from '../firebase';
import { useWeb3React } from '@web3-react/core';
// import { ethers } from 'ethers';
import { Link, useNavigate } from 'react-router-dom';
import { MaticBlack } from '../components/svg';
import videojs from "video.js";
import { doc, setDoc, getDoc, updateDoc, onSnapshot, query, collection, getDocs, deleteDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ethers } from "ethers";
import Web3 from "web3";
import abi from '../abi/yourContract.json';
import { Biconomy } from '@biconomy/mexa';
// import yourContract from "../abi/yourContract.json"
// import "videojs-contrib-hls";
// import "videojs-contrib-quality-levels";
import "videojs-hls-quality-selector";
import "video.js/dist/video-js.min.css";
import ChatBox from '../components/ChatBox';
import { SideNavBar } from '../components/sideNav';
const CreateStream = () => {
    const navigate = useNavigate();
    const { account } = useWeb3React();
    const [activeViewers, setActiveViewers] = useState([]);
    // const [hlsUrl, setHlsUrl] = useState("");
    const [thumbUploaded, setThumbUploaded] = useState(false);
    const [thumbLoaded, setThumbLoaded] = useState(false);
    const [playbackId, setPlaybackId] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [streamId, setStreamId] = useState("");
    const [streamKey, setStreamKey] = useState("--- --- ---");
    const [videoEl, setVideoEl] = useState(null);
    const [thumbNail, setThumbNail] = useState("");
    const [title, setTitle] = useState("Title...")
    const [desc, setDesc] = useState("Description...")
    const [airDrop, setAirDrop] = useState("")
    const biconomy = new Biconomy(window.ethereum, {
        apiKey: "SdY8w1F5T.bb9f1dd2-4dda-42b2-9e8f-c9d6bb4a14eb",
        debug: true,
    });
    const address = "0x4a3697426a2bd130CE2bB755DdF883FE8BDfBFE4"
    const web3 = new Web3(biconomy);
    const contract = new web3.eth.Contract(
        abi,
        address
    );
    const connectedContract = new ethers.Contract(address, abi, new ethers.providers.Web3Provider(window.ethereum).getSigner());
    useEffect(() => {
        if (!window.ethereum) {
            console.log("Metamask is required to use this DApp");
            return;
        }
        biconomy
            .onEvent(biconomy.READY, async () => {
                // Initialize your dapp here like getting user accounts etc
                await window.ethereum.enable();
                // console.log(`MUMBAI SMART CONTRACT`);
                // console.log(contract);
                // startApp();
            })
            .onEvent(biconomy.ERROR, (error, message) => {
                // Handle error while initializing mexa
                console.log(error);
            });
    }, []);
    useEffect(() => {
        getData()
        return async () => {
            const q = query(collection(db, account));
            const querySnapshot = await getDocs(q);

            const deleteOps = [];

            querySnapshot.forEach((doc) => {
                deleteOps.push(deleteDoc(doc.ref));
            });
        }
    }, [])

    const getData = async () => {
        // console.log("Document data:", docSnap.data().playbackId);
        onSnapshot(doc(db, "users", account), (doc) => {
            setPlaybackId(doc.data().playbackId)
            setTitle(doc.data().title)
            setDesc(doc.data().desc)
            setActiveViewers(doc.data().viewers)
        });
    }
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
            setTimeout(() => {
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

                // player.hlsQualitySelector();

                player.on("error", () => {
                    player.src(`https://cdn.livepeer.com/hls/${playbackId}/index.m3u8`);
                });
            }, 5000)
        }
    }, [isActive, playbackId]);
    // useEffect(() => {
    //     onSnapshot(doc(db, "users", account))
    // })
    useEffect(() => {
        titleDescUpdate()
    }, [title, desc, thumbNail])
    // const contractInit = async () => {
    //     // const signer = contract.connect(library.getSigner());
    //     const contract = new ethers.Contract("0x48E258c7be52d92fb4769a40096daB2016365603", yourContract, library)
    //     const random = await contract.randomResult();
    //     const signer = contract.connect(library.getSigner());
    //     await signer.getRandomNumber();
    //     console.log("waiting for generation")
    //     contract.on("NewRandomNumber", (user, number) => {
    //         console.log(`${user} generated ${number}`)
    //     })
    //     // console.log("Response : " + random);
    //     // console.log(contract)
    //     // const random


    // }
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
            desc: "",
            rewards: []
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
                setThumbLoaded(true)
                const prog = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                console.log(prog)
            },
            (error) => console.log(error),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    const a = downloadURL
                    setThumbNail(a)
                    setThumbUploaded(true)
                });
            }
        );
        // await updateDoc(doc(db, "users", account), {
        //     "thumbNail": thumbNail
        // });
    }
    const thumbnailHandler = async (e) => {
        console.log("Bwahahahahahahaha")
        const file = e.target.files[0];
        uploadThumbnail(file);
        // await updateDoc(doc(db, "users", account), {
        //     "thumbNail": thumbNail
        // });
    };
    const titleDescUpdate = async () => {
        await updateDoc(doc(db, "users", account), {
            "title": title,
            "desc": desc,
            "thumbNail": thumbNail,
        });
    }
    const airDropped = async () => {
        let randomNumber = Math.floor(Math.random() * activeViewers.length);
        const res = await connectedContract.airDrop(activeViewers[randomNumber], { value: ethers.utils.parseEther(airDrop), from: account })
        console.log(res);
    }
    return (
        <div className="flex ">
            <SideNavBar />
            <div className="p-[5vw]">
                <div className="w-[70vw] bg-black min-w-[1100px] aspect-video overflow-clip"><div data-vjs-player>
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
                        <div className="flex justify-between h-auto w-[70%] bg-[#3f3f3f] px-5 py-3 items-center mt-10 rounded-xl text-white">
                            {/* <MaticWhite /> */}
                            <label className='mr-10'>ThumbNail</label>
                            <input type="file" className="input" onChange={thumbnailHandler} />
                        </div>
                        <span>{thumbUploaded ? "Uploaded" : thumbLoaded ? "Loading..." : ""}</span>
                        <div className="flex justify-between h-auto w-[70%] bg-[#3f3f3f] px-5 py-3 items-center mt-20 rounded-xl text-white">
                            {/* <MaticWhite /> */}
                            <label className='mr-10'>StreamKey</label>
                            <div className="text-2xl font-light text-white tracking-wider">{streamKey}</div>
                        </div>

                    </div>

                </div>
                <div className='flex justify-between bg-[#3f3f3f] text-white rounded-2xl p-4 max-h-[400px] w-full'>
                    <div>{activeViewers ? activeViewers.length : 0}</div>
                    <ChatBox id={account} />
                </div>
                <div className="flex justify-between items-center">
                    <button className="bg-[#B11414] h-[50px] w-[25%] rounded-2xl my-8 text-white tracking-widest text-xl" onClick={() => navigate('/')}>
                        End
                    </button>
                    <div className="flex justify-between h-auto w-auto bg-[#D3D3D3] px-4 py-3 items-center my-8 rounded-xl">
                        <MaticBlack />
                        <div className='w-[30%]'>
                            <input type="text" pattern="[0-9]*" className="text-lg text-[#848484] bg-transparent w-full outline-none border-b-black border-b-2" onChange={(e) => setAirDrop(e.target.value)} />
                        </div>
                        <button className="bg-[#3f3f3f] h-[74px] w-[40%] -my-3 -mr-4 rounded-2xl text-white text-xl tracking-widest" onClick={() => airDropped()}>
                            AIRDROP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateStream;