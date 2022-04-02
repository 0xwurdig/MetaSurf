import React, { useState, useEffect, useCallback } from 'react'
import { db, storage } from '../firebase';
import { useWeb3React } from '@web3-react/core'
import { Link, useNavigate } from 'react-router-dom';
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { create as ipfsHttpClient } from 'ipfs-http-client'
import abi from '../abi/yourContract.json'
import { Biconomy } from '@biconomy/mexa';
import Web3 from "web3";
const ipfs = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
const NFT_Port_API = "05c9c773-8027-45ad-99b1-5888d2e83412"

const CreateVideo = () => {
    const { account } = useWeb3React();
    const navigate = useNavigate();

    const [thumbNail, setThumbNail] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [title, setTitle] = useState("Title...")
    const [desc, setDesc] = useState("Description...")
    const [loading, setLoading] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const biconomy = new Biconomy(window.ethereum, {
        apiKey: "P6g4LGJOy.30ed56bf-2bcb-4eb3-b616-a88f787aa2e8",
        debug: true,
    });
    const address = "0xfB59d267570D4Ea182662534d7F7ED431F870a68"

    const web3 = new Web3(biconomy);
    const contract = new web3.eth.Contract(
        abi,
        address
    );
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
        const res = await fetch("https://api.nftport.xyz/v0/metadata", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": NFT_Port_API
            },
            "body": "{\"name\":\"My Art\",\"description\":\"This is my custom art piece\",\"file_url\":\"https://ipfs.io/ipfs/QmRModSr9gQTSZrbfbLis6mw21HycZyqMA3j8YMRD11nAQ\"}"
        })
            .then(response => response.json())
            .catch(err => {
                console.error(err);
            });
        const metadataUri = res.metadata_uri
        let tx = await contract.methods.createVideoNFT(metadataUri).send({
            from: window.ethereum.selectedAddress,
            signatureType: biconomy.EIP712_SIGN,
            //optionally you can add other options like gasLimit
        }).then(tokenId => { console.log(tokenId) });
        tx.on("transactionHash", function (hash) {
            console.log(`Transaction hash is ${hash}`);
            console.log(`Transaction sent. Waiting for confirmation ..`);
        }).once("confirmation", function (confirmationNumber, receipt) {
            console.log(receipt);
            console.log(receipt.transactionHash);
            //do something with transaction hash
        });
        // await addDoc(collection(db, "videos"), {
        //     // "tokenId":
        //     "metadataUri":metadataUri,
        //     "views":[],
        // }).then(() =>
        //     navigate("/home")
        // )
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
                            <button className="bg-[#b5b5b5] h-[50px] w-[25%] rounded-2xl my-8 text-white tracking-widest text-xl ali hover:bg-[#3f3f3f] hover:text-white" onClick={() => titleDescUpdate()}>
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