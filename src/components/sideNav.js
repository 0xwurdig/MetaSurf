import React, { useState, useEffect } from "react"
import { db } from "../firebase"
import { Link } from 'react-router-dom';
import { getDoc, query, collection, where, doc, onSnapshot } from "firebase/firestore";
import { useWeb3React } from '@web3-react/core';


export const SideNavBar = () => {
    const { account } = useWeb3React();
    const [isMerch, setIsMerch] = useState(false);
    useEffect(() => {
        getData();
    })
    const getData = async () => {
        const q = doc(db, "merch", "merch");
        const docSnap = await getDoc(q);

        if (docSnap.exists() && docSnap.data().merch.includes(account)) {
            setIsMerch(true);
            // console.log("Document data:", docSnap.data().playbackId);
        }
    }
    return (
        <div className="bg-[#3f3f3f] min-h-[100vh] h-auto w-[20vw] py-10 px-20 text-lg text-[#b5b5b5]">
            {!isMerch ? <ul>
                <li className="my-4"><Link to="/">Home</Link></li>
                <li className="my-4"><Link to="/dashboard">Dashboard</Link></li>
                <li className="my-4"><Link to="/createStream">Stream</Link></li>
                <li className="my-4"><Link to="/createVideo">Mint Videos</Link></li>
                <li className="my-4"><Link to="/rewards">Rewards</Link></li>
            </ul> : <ul>
                {/* <li className="my-4"><Link to="/">Home</Link></li> */}
                <li className="my-4"><Link to="/merchDashboard">Dashboard</Link></li>
                <li className="my-4"><Link to="/createNft">Create Ad</Link></li>
            </ul>
            }
        </div>
    )
}