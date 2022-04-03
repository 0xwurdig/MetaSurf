import React, { useEffect, useState } from 'react'
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { useWeb3React } from '@web3-react/core';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MaticBlack, MaticWhite } from '../components/svg';
import { db } from '../firebase';
import { ethers } from "ethers";
import Web3 from "web3";
import abi from '../abi/yourContract.json';
import { Biconomy } from '@biconomy/mexa';

const WatchVideo = () => {
    const params = useParams()
    const { account, library } = useWeb3React();
    const navigate = useNavigate()
    const id = params.id
    const [videoUrl, setVideoUrl] = useState("")
    const [thumbnail, setThumbnail] = useState("")
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [owner, setOwner] = useState("")
    const [tips, setTips] = useState(0)
    const [tip, setTip] = useState(0)
    const biconomy = new Biconomy(window.ethereum, {
        apiKey: "P6g4LGJOy.30ed56bf-2bcb-4eb3-b616-a88f787aa2e8",
        debug: true,
    });
    const address = "0x48fd9124F7890E92d3097163860B9aEAc5D9928d"
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
        onSnapshot(doc(db, "videos", id), (doc) => {
            setVideoUrl(doc.data().video)
            setThumbnail(doc.data().thumbnail)
            setTitle(doc.data().title)
            setDesc(doc.data().desc)
            setOwner(doc.data().owner)
            setTips(doc.data().tips)
        });
    })
    //   const onQuoteChange = (event) => {
    //     setNewQuote(event.target.value);
    //   };

    async function onButtonClickMeta() {
        // connectedContract.tip(27, { value: ethers.utils.parseEther("0.1") })
        // // contract.methods.tip(27).send({
        // //     value: "100000000000000000",
        // //     from: account,
        // //     signatureType: biconomy.EIP712_SIGN,
        // //     //optionally you can add other options like gasLimit
        // // })
        // contract.methods.tip(27).send({ from: account, value: "100000000000000000", signatureType: biconomy.EIP712_SIGN })
        //     .on('transactionHash', function (hash) {
        //         console.log(hash)
        //         console.log("^^^^^^^^^^^^^^^")
        //     })
        //     .on('confirmation', function (confirmationNumber, receipt) {
        //         console.log(receipt.transactionHash)
        //         console.log("^^^^^^^^^^^^^^^")
        //     })
        //     .on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        //         console.log(error)
        //     });
        const res = await connectedContract.tip(id, { value: ethers.utils.parseEther(tip), from: account }).then(async () => {
            await setDoc(doc(db, "videos", id), { "tips": parseFloat(tips) + parseFloat(tip) }, { merge: true })
        })
        // console.log(tip);
        // console.log(+(tip));
        // console.log(res)
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
                <div className="w-[70vw]  min-w-[1100px] max-h-[1000px] overflow-clip">
                    <video
                        id="video"
                        // ref={onVideo}
                        src={videoUrl}
                        className="h-full w-full video-js vjs-theme-city"
                        controls
                        playsInline
                        poster={thumbnail}
                    />
                </div>
                <div className="flex  justify-between min-h-[300px]">
                    <div>
                        <h1 className="text-3xl font-medium my-12 mx-16">{title}</h1>
                        <p className="text-[#b5b5b5] w-[40vw] min-h[150px] mx-16">{desc}</p>

                    </div>
                    <div>
                        <div className="flex justify-between h-auto w-auto bg-[#3f3f3f] px-4 py-3 items-center my-10 rounded-xl">
                            <MaticWhite />
                            <div className="text-4xl font-light text-white tracking-wider ml-5">{tips}</div>
                        </div>

                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <button className="bg-[#B11414] h-[50px] w-[25%] rounded-2xl my-8 text-white tracking-widest text-xl" onClick={() => { navigate("/") }}>
                        Back
                    </button>
                    <div className="flex justify-between h-auto w-auto bg-[#D3D3D3] px-4 py-3 items-center rounded-xl">
                        <MaticBlack />
                        <div className='w-[30%]'>
                            <input type="number" className="text-lg text-[#848484] bg-transparent w-full outline-none border-b-black border-b-2" onChange={(e) => setTip(e.target.value)} />
                        </div>
                        <button className="bg-[#3f3f3f] h-[74px] w-[40%] -my-3 -mr-4 rounded-2xl text-white text-xl tracking-widest" onClick={() => onButtonClickMeta()} >
                            TIP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WatchVideo;