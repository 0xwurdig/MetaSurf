import React, { useState, useEffect } from "react"
import { db } from "../firebase"
import { Link } from 'react-router-dom';
import { getDocs, query, collection, where, doc, onSnapshot } from "firebase/firestore";


export const VideoTiles = (props) => {
    const [title, setDetails] = useState("------ ------")
    const [wallet, setWallet] = useState("--------------------------------------")
    const [thumbnail, setThumbnail] = useState("/newYork.jpg")
    useEffect(() => {
        getData()
    }, [])
    const getData = async () => {
        onSnapshot(doc(db, "videos", props.id), (doc) => {
            setWallet(doc.data().owner)
            setDetails(doc.data().title)
            setThumbnail(doc.data().thumbNail)
        });
    }
    return (
        <Link to={`/video/${props.id}`}>
            <div className="mr-10 w-[22vw]">
                <img alt="" src={thumbnail} className="w-full aspect-video" />
                <div className="flex justify-between items-center mt-2">
                    <div className="w-[70%] h-auto">
                        <p className="text-lg text-ellipsis overflow-hidden">{title}</p>
                        <p className="text-[#b5b5b5] text-xs text-ellipsis overflow-hidden">{wallet}</p>
                    </div>
                    <div className="w-10 h-10 bg-[#b5b5b5] overflow-clip rounded-full">
                        <img alt="" src="https://www.larvalabs.com/public/images/cryptopunks/punk1385.png" className="object-contain w-full" />
                    </div>
                </div>
            </div>

        </Link>
    )
}