import React, { useEffect, useState } from 'react'
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import Web3 from "web3";
import { useWeb3React } from '@web3-react/core';
import { ethers } from "ethers";
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MaticBlack, MaticWhite } from '../components/svg';
import { db } from '../firebase';
import abi from '../abi/yourContract.json';
import { Biconomy } from '@biconomy/mexa';
const address = "0xDA0bab807633f07f013f94DD0E6A4F96F8742B53"

const WatchVideo = () => {
    const params = useParams()
    const { account, library } = useWeb3React();
    const navigate = useNavigate()
    const id = params.id
    const [videoUrl, setVideoUrl] = useState("")
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [owner, setOwner] = useState("")
    const [tips, setTips] = useState(0)
    const biconomy = new Biconomy(window.ethereum, {
        apiKey: "P6g4LGJOy.30ed56bf-2bcb-4eb3-b616-a88f787aa2e8",
        debug: true,
    });

    const web3 = new Web3(biconomy);
    const contract = new web3.eth.Contract(
        abi,
        address
    );
    const readContract = new ethers.Contract(address, abi, library)

    useEffect(() => {
        onSnapshot(doc(db, "videos", id), (doc) => {
            setVideoUrl(doc.data().video)
            setTitle(doc.data().title)
            setDesc(doc.data().desc)
            setOwner(doc.data().owner)
            setTips(doc.data().tips)
        });
    })
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
    //   const onQuoteChange = (event) => {
    //     setNewQuote(event.target.value);
    //   };

    async function onButtonClickMeta() {
        let tx = contract.methods.getRandomNumber().send({
            from: window.ethereum.selectedAddress,
            signatureType: biconomy.EIP712_SIGN,
            //optionally you can add other options like gasLimit
        });
        tx.on("transactionHash", function (hash) {
            console.log(`Transaction hash is ${hash}`);
            console.log(`Transaction sent. Waiting for confirmation ..`);
        }).once("confirmation", function (confirmationNumber, receipt) {
            console.log(receipt);
            console.log(receipt.transactionHash);
            //do something with transaction hash
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
                <div className="w-[70vw]  min-w-[1100px] max-h-[1000px] overflow-clip">
                    <video
                        id="video"
                        // ref={onVideo}
                        src={videoUrl}
                        className="h-full w-full video-js vjs-theme-city"
                        controls
                        playsInline
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
                        Leave
                    </button>
                    <div className="flex justify-between h-auto w-auto bg-[#D3D3D3] px-4 py-3 items-center rounded-xl">
                        <MaticBlack />
                        <div className='w-[30%]'>
                            <input type="text" pattern="[0-9]*" className="text-lg text-[#848484] bg-transparent w-full outline-none border-b-black border-b-2" onChnage />
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