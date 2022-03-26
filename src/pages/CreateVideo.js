import React, { useState, useEffect, useCallback } from 'react'
import { db, storage } from '../firebase';
import { useWeb3React } from '@web3-react/core'
import { Link, useNavigate } from 'react-router-dom';
import { doc, addDoc, getDoc, updateDoc, collection } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { create as ipfsHttpClient } from 'ipfs-http-client'
const ipfs = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
// import "videojs-contrib-hls";
// import "videojs-contrib-quality-levels";
const CreateVideo = () => {
    const { account } = useWeb3React();
    const navigate = useNavigate();

    const [thumbNail, setThumbNail] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [title, setTitle] = useState("Title...")
    const [desc, setDesc] = useState("Description...")
    const [loading, setLoading] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const uploadThumbnail = (file) => {
        if (!file) return;
        const storageRef = ref(storage, `/files/${account}/${file.name}`);
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
    const uploadFile = async (file) => {
        setLoading(true)
        console.log("loading video")
        try {
            const added = await ipfs.add(file)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setVideoUrl(url)
            setUploaded(true)
            console.log("uploaded video")
        } catch (err) {
            console.log('Error uploading the file : ', err)
        }
        setLoading(false)
    }
    const thumbnailHandler = async (e) => {
        console.log("Bwahahahahahahaha")
        const file = e.target.files[0];
        uploadThumbnail(file);
        // await updateDoc(doc(db, "users", account), {
        //     "thumbNail": thumbNail
        // });
    };
    const videoHandler = async (e) => {
        console.log("Bwahahahahahahaha")
        const file = e.target.files[0];
        uploadFile(file);
        // await updateDoc(doc(db, "users", account), {
        //     "thumbNail": thumbNail
        // });
    };

    const mint = async () => {
        await addDoc(collection(db, "videos"), {
            "title": title,
            "desc": desc,
            "owner": account,
            "thumbNail": thumbNail,
            "video": videoUrl,
            "tips": 0
        }).then(() =>
            navigate("/home")
        )
    }
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
                <div className="w-[70vw]  min-w-[1100px] max-h-[1000px] overflow-clip"><div data-vjs-player>


                    <video
                        id="video"
                        // ref={onVideo}
                        src={videoUrl}
                        className="h-full w-full video-js vjs-theme-city"
                        controls
                        playsInline
                        poster={thumbNail}
                    />

                </div>
                </div>
                <div className="flex w-[70vw] justify-between">
                    <div>
                        <textarea value={title} onChange={(e) => setTitle(e.target.value)} className="text-3xl font-medium my-12 mx-16 min-w-[600px] w-[40vw] h-auto" />

                        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="text-[#b5b5b5] min-w-[600px] w-[40vw] min-h-[150px] mx-16 outline-none " />
                        {/* <div className="flex justify-end mx-16 min-w-[600px] w-[40vw]">
                            <button className="bg-[#b5b5b5] h-[50px] w-[25%] rounded-2xl my-8 text-white tracking-widest text-xl ali" onClick={() => titleDescUpdate()}>
                                Save
                            </button>
                        </div> */}
                    </div>
                    <div>
                        <div className="flex justify-between h-auto w-[70%] bg-[#3f3f3f] px-5 py-3 items-center my-10 rounded-xl text-white">
                            {/* <MaticWhite /> */}
                            <label className='mr-10'>ThumbNail</label>

                            <input type="file" className="input" onChange={thumbnailHandler} />
                        </div>
                        <div className="flex justify-between h-auto w-[70%] bg-[#3f3f3f] px-5 py-3 items-center mt-10 rounded-xl text-white">
                            {/* <MaticWhite /> */}
                            <label className='mr-10'>Video</label>
                            <input type="file" className="input" onChange={videoHandler} />
                        </div>
                        <span>{uploaded ? "Uploaded" : loading ? "Loading..." : ""}</span>

                    </div>

                </div>
                <div className="flex justify-between items-center">
                    <button className="bg-[#B11414] h-[50px] w-[25%] rounded-2xl my-8 text-white tracking-widest text-xl">
                        Cancel
                    </button>
                    {

                    }
                    <button className="bg-[#3f3f3f] h-[50px] w-[25%] rounded-2xl my-8 text-white tracking-widest text-xl" onClick={() => mint()}>
                        Mint
                    </button>

                </div>
            </div>
        </div>
    );
};

export default CreateVideo;