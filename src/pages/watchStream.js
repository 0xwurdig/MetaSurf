import React, { useEffect, useState, useCallback } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { MaticBlack, MaticWhite } from '../components/svg';
import ChatBox from '../components/ChatBox';

import videojs from "video.js";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import "videojs-hls-quality-selector";
import "video.js/dist/video-js.min.css";
import Web3 from "web3";
import { Framework } from "@superfluid-finance/sdk-core";
import { Biconomy } from '@biconomy/mexa';
import { ethers } from "ethers";
import { SideNavBar } from '../components/sideNav';
// import {
//     BatchOperation
// } from "@superfluid-finance/ethereum-contracts/interfaces/superfluid/ISuperfluid.sol";
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
    const [streamOn, setStreamOn] = useState(false)
    const MATICx = "0x96B82B65ACF7072eFEb00502F45757F254c2a0D4";
    const flowRate = 1000000000000;
    // const ether = new ethers.providers.Web3Provider(biconomy)
    const onVideo = useCallback((el) => {
        setVideoEl(el);
    }, []);
    useEffect(() => {
        getData()
        return async () => {
            const docRef = doc(db, "users", id);
            await updateDoc(docRef, {
                viewers: arrayRemove(account)
            });
        }
    }, [])

    const getData = async () => {
        const docRef = doc(db, "users", id);
        await updateDoc(docRef, {
            viewers: arrayUnion(account)
        });
        onSnapshot(doc(db, "users", id), (doc) => {
            setPlaybackId(doc.data().playbackId)
            setTitle(doc.data().title)
            setDesc(doc.data().desc)
            setActiveViewers(doc.data().viewers)
        });
        console.log(playbackId)
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
        console.log(playbackId);
    }, [playbackId]);
    useEffect(() => {
        if (!window.ethereum) {
            console.log("Metamask is required to use this DApp");
            return;
        }
        startFlow(flowRate)
        // return () => { deleteFLow() }
    }, []);
    async function startFlow(flowRate) {
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const sf = await Framework.create({
            chainId: Number(chainId),
            provider: provider
        });
        const MATICXX = await sf.loadSuperToken(
            MATICx
        );
        try {
            sf.batchCall([
                MATICXX.createFlow({
                    sender: account,
                    receiver: "0x3A920fBe9A3C4Bd3a95ad9BA146dFbcE8fF0154C",
                    flowRate: flowRate * 0.98,
                    superToken: MATICx
                    // userData?: string
                }), MATICXX.createFlow({
                    sender: account,
                    receiver: id,
                    flowRate: flowRate * 0.02,
                    superToken: MATICx
                    // userData?: string
                })]
            ).exec(provider.getSigner()).then(function (tx) {
                console.log(
                    `Congrats - you've just successfully executed a batch call!
                  You have completed 2 operations in a single tx 🤯
                  View the tx here:  https://kovan.etherscan.io/tx/${tx.hash}
                  View Your Stream At: https://app.superfluid.finance/dashboard/${id}
                  Network: Kovan
                  Super Token: DAIx
                  Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
                  Receiver: ${id},
                }
                  `
                );
            });
            // const createFlowOperation = sf.cfaV1.createFlow({
            //     receiver: recipient,
            //     flowRate: flowRate,
            //     superToken: MATICx
            //     // userData?: string
            // });

            // console.log("Creating your stream...");

            // const result = await createFlowOperation.exec(provider.getSigner());
            // console.log(result);
            // console.log(
            //     `Congrats - you've just created a money stream!
            // View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
            // Network: Kovan
            // Super Token: DAIx
            // Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
            // Receiver: ${recipient},
            // FlowRate: ${flowRate}
            // `
            // );
            setStreamOn(true);
        } catch (error) {
            console.log(
                "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
            );
            console.error(error);
        }
    }
    async function deleteFLow(recipient) {
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const sf = await Framework.create({
            chainId: Number(chainId),
            provider: provider
        });
        const MATICXX = await sf.loadSuperToken(
            MATICx
        );
        try {
            sf.batchCall([
                MATICXX.deleteFlow({
                    sender: account,
                    receiver: "0x3A920fBe9A3C4Bd3a95ad9BA146dFbcE8fF0154C",
                    superToken: MATICx
                    // userData?: string
                }), MATICXX.deleteFlow({
                    sender: account,
                    receiver: id,
                    superToken: MATICx
                    // userData?: string
                })]
            ).exec(provider.getSigner()).then(function (tx) {
                console.log(
                    `Congrats - you've just successfully executed a batch call!
                  You have completed 2 operations in a single tx 🤯
                  View the tx here:  https://kovan.etherscan.io/tx/${tx.hash}
                  View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
                  Network: Kovan
                  Super Token: DAIx
                  Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
                  Receiver: ${recipient},
                  FlowRate: ${flowRate}
                  `
                );
            });
            // const createFlowOperation = sf.cfaV1.createFlow({
            //     receiver: recipient,
            //     flowRate: flowRate,
            //     superToken: MATICx
            //     // userData?: string
            // });

            // console.log("Creating your stream...");

            // const result = await createFlowOperation.exec(provider.getSigner());
            // console.log(result);
            // console.log(
            //     `Congrats - you've just created a money stream!
            // View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
            // Network: Kovan
            // Super Token: DAIx
            // Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
            // Receiver: ${recipient},
            // FlowRate: ${flowRate}
            // `
            // );
        } catch (error) {
            console.log(
                "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
            );
            console.error(error);
        }
    }

    const leaveStream = async () => {
        // const docRef = doc(db, "users", id);
        // await updateDoc(docRef, {
        //     viewers: arrayRemove(account)
        // }).then(() => navigate('/'));
        console.log("Delete Flow")
        deleteFLow(account).then(() => navigate('/'))
    }
    return (
        <div className="flex ">
            <SideNavBar />
            <div className="p-[5vw]">
                <div className="w-[70vw]  min-w-[1100px] max-h-[1000px] overflow-clip">
                    <video
                        id="video"
                        ref={streamOn ? onVideo : null}
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
                <div className='flex justify-between bg-[#3f3f3f] text-white rounded-2xl p-4 max-h-[400px] w-full'>
                    <ChatBox id={id} />
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