import React, { useState, useEffect } from "react"
import { db } from "../firebase"
import { Link } from 'react-router-dom';
import { getDocs, query, collection, where } from "firebase/firestore";


export const StreamTiles = (props) => {
    const [title, setDetails] = useState("------ ------")
    const [wallet, setWallet] = useState("--------------------------------------")
    const [thumbnail, setThumbnail] = useState("/newYork.jpg")
    useEffect(() => {
        getData()
    }, [])
    const getData = async () => {
        const q = query(collection(db, "users"), where("streamId", "==", props.id));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // setDetails({
            //     title: doc.data().title,
            //     streamer: doc.id
            // })
            console.log(doc.data())
            setWallet(doc.id)
            setDetails(doc.data().title)
            setThumbnail(doc.data().thumbNail)
        });
    }
    return (
        <Link to={`/stream/${wallet}`}>
            <div className="mr-10">
                <div className="w-[40vw] aspect-video overflow-clip"><img className="w-full" alt="" src={thumbnail} /></div>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl my-5">{title}</h1>
                        <p className="text-[#b5b5b5] text-sm">{wallet}</p>
                    </div>
                    <div className="w-auto h-16 bg-[#b5b5b5] overflow-clip rounded-full">
                        <img alt="" src="https://www.larvalabs.com/public/images/cryptopunks/punk1385.png" className="h-full object-contain" />
                    </div>
                </div>
            </div>
        </Link>
    )
}