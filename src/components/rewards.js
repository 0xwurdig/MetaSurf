import React, { useState, useEffect } from "react"
import { Link } from 'react-router-dom';

export const RewardTiles = (props) => {
    const NFT_Port_API = "05c9c773-8027-45ad-99b1-5888d2e83412"
    const [title, setTitle] = useState("------ ------")
    const [desc, setDesc] = useState("--------------------------------------")
    const [thumbnail, setThumbnail] = useState("/newYork.jpg")
    useEffect(() => {
        getData()
    }, [])
    const getData = async () => {
        const res = await fetch("https://ipfs.io/ipfs/" + props.nft.metadataUri.split("//")[1])
            .then(response => response.json())
            .catch(err => {
                console.error(err);
            });
        setTitle(res.name);
        setDesc(res.description);
        setThumbnail(res.image);
    }
    return (
        // <Link to={`/video/${props.nft.tokenId}`}>
        <div className="mr-10 w-[22vw]">
            <img alt="" src={thumbnail} className="w-full aspect-video" />
            <div className="flex justify-between items-center mt-2">
                <div className="w-[70%] h-auto">
                    <p className="text-lg text-ellipsis overflow-hidden">{title}</p>
                    <p className="text-[#b5b5b5] text-xs text-ellipsis overflow-hidden">{desc}</p>
                </div>
                <div className="w-10 h-10 bg-[#b5b5b5] overflow-clip rounded-full">
                    <img alt="" src="https://www.larvalabs.com/public/images/cryptopunks/punk1385.png" className="object-contain w-full" />
                </div>
            </div>
        </div>

        // </Link>
    )
}