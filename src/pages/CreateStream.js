import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { MaticBlack, MaticWhite, StreamStart } from '../components/svg';
import ReactHlsPlayer from 'react-hls-player';


const CreateStream = () => {
    const { account } = useWeb3React();
    // const [streamId, setStreamId] = useState("");
    const [playbackId, setPlaybackId] = useState("");
    const [streamKey, setStreamKey] = useState("--- --- ---");
    useEffect(() => {
        const docRef = db.collection("users").doc(account);

        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
            } else {
                // doc.data() will be undefined in this case
                getApiData()
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }, []);
    const getApiData = async () => {
        const response = await fetch(
            "https://livepeer.com/api/stream", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer 2a005d4f-3661-4470-8314-81405f6e616e"
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
        setPlaybackId(response.playbackId)
        setStreamKey(response.streamKey)
    };
    return (
        <div className="flex ">
            <div className="bg-[#3f3f3f] h-auto w-auto py-10 px-20 text-lg text-[#b5b5b5]">
                <ul>
                    <li className="my-4"><Link to="/">Home</Link></li>
                    <li className="my-4"><Link to="dashboard">Dashboard</Link></li>
                    <li className="my-4"><Link to="createStream">Stream</Link></li>
                    <li className="my-4">Video NFT</li>
                </ul>
            </div>
            <div className="p-[5vw]">
                <div className="w-[70vw]"><ReactHlsPlayer
                    src={"https://cdn.livepeer.com/hls/" + playbackId + "/index.m3u8"}
                    autoPlay={false}
                    controls={true}
                    width="100%"
                    height="auto"
                /></div>
                <div className="flex">
                    <div>
                        <h1 className="text-3xl font-medium my-12 mx-16">My new travel in New York!</h1>

                        <p className="text-[#b5b5b5] w-[40vw] min-h-[150px] mx-16">We zijn jong, we zijn oud. We zijn groot, we zijn klein. We zijn jouw grootste bron van inspiratie en je grootste provocateur. We zijn veel dingen, maar we zijn niet gemiddeld. De waarheid is dat mensen niet echt om merken geven. Daarom moeten merken relevant zijn om de tijd van mensen te verdienen. Wij zorgen er voor dat jouw merk relevant wordt.</p>
                        <button className="bg-[#B11414] h-[50px] w-[25%] rounded-2xl my-8 text-white tracking-widest text-xl">
                            Cancel
                        </button>
                    </div>
                    <div>
                        <div className="flex justify-between h-auto w-auto bg-[#3f3f3f] px-5 py-3 items-center my-10 rounded-xl">
                            {/* <MaticWhite /> */}
                            <div className="text-4xl font-light text-white tracking-wider">{streamKey}</div>
                        </div>
                        <div className="flex justify-between h-auto w-auto bg-[#D3D3D3] px-4 py-3 items-center my-48 rounded-xl">
                            <h1 className="text-3xl font-medium">Start</h1>
                            <button className="bg-[#3f3f3f] h-[64px] w-[40%] -my-3 -mr-4 rounded-2xl text-white text-xl tracking-widest pl-[13%]" onClick={() => getApiData()}>
                                <StreamStart />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateStream;