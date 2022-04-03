import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { StreamTiles } from '../components/stream';
import { VideoTiles } from '../components/video';
import { useWeb3React } from '@web3-react/core';
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';
import { SideNavBar } from '../components/sideNav';
import { RewardTiles } from '../components/rewards';



const Rewards = () => {
    const [rewards, setRewards] = useState([]);
    const { account } = useWeb3React();
    useEffect(() => {
        getData()
    }, [])
    const getData = async () => {
        const docRef = doc(db, "users", account)
        const docSnap = await getDoc(docRef);
        const rewardTokens = docSnap.data().rewards;

        rewardTokens.forEach(async (tokenId) => {
            const docRef = doc(db, "advertisements", tokenId.toString())
            const docSnap = await getDoc(docRef);
            // doc.data() is never undefined for query doc snapshots
            // setDetails({
            //     title: doc.data().title,
            //     streamer: doc.id
            // })
            let data = docSnap.data()
            setRewards(state => [...state, data])
        });
    }
    const carouselRewards = rewards.map(function (video, index) {
        return (
            <RewardTiles nft={video} key={index} />
        );
    });
    return (
        <div className="flex">
            <SideNavBar />
            {
                account
                    ? <div className="p-[5vw]">
                        <h1 className="text-4xl font-semibold my-10 ">Rewards...</h1>
                        <div className="flex flex-wrap pb-10 w-[70vw]">
                            {rewards.length !== 0 ? carouselRewards : <h1>Nothing to show</h1>}
                        </div>

                    </div>
                    : <div className="flex w-[80vw] h-[100vh]  justify-center items-center text-4xl font-semibold text-center">
                        Please Connect your wallet <br /> to view content
                    </div>
            }
        </div>

    );
};

export default Rewards;