import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { Biconomy } from '@biconomy/mexa';
import Web3 from "web3";
import abi from '../abi/yourContract.json'
import { ethers } from 'ethers'
import TextField from './TextField';
const ipfs = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const NFTForm = () => {
  const { account } = useWeb3React();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [uploaded1, setUploaded1] = useState(false);
  const [videoUrl, setVideoUrl] = useState("https://www.logistec.com/wp-content/uploads/2017/12/placeholder.png");
  const [nftUrl, setNftUrl] = useState("https://www.logistec.com/wp-content/uploads/2017/12/placeholder.png");
  const NFT_Port_API = "05c9c773-8027-45ad-99b1-5888d2e83412"
  const biconomy = new Biconomy(window.ethereum, {
    apiKey: "SdY8w1F5T.bb9f1dd2-4dda-42b2-9e8f-c9d6bb4a14eb",
    debug: true,
  });
  const address = "0x4a3697426a2bd130CE2bB755DdF883FE8BDfBFE4"

  const web3 = new Web3(biconomy);
  const contract = new web3.eth.Contract(
    abi,
    address
  );
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const ethersContract = new ethers.Contract(address, abi, provider);

  useEffect(() => {
    if (!window.ethereum) {
      console.log("Metamask is required to use this DApp");
      return;
    }
    biconomy
      .onEvent(biconomy.READY, async () => {
        // Initialize your dapp here like getting user accounts etc
        await window.ethereum.enable();
        console.log(`MUMBAI SMART CONTRACT`);
        // console.log(contract);
        // startApp();
      })
      .onEvent(biconomy.ERROR, (error, message) => {
        // Handle error while initializing mexa
        console.log(error);
      });
  }, []);
  const uploadFile = async (file) => {
    setLoading(true)
    console.log("loading video")
    try {
      const added = await ipfs.add(file)
      const url = `https://ipfs.io/ipfs/${added.path}`
      setNftUrl(url)
      setUploaded(true)
      console.log("uploaded video")
    } catch (err) {
      console.log('Error uploading the file : ', err)
    }
    setLoading(false)
  }
  const uploadVideo = async (file) => {
    setLoading1(true)
    console.log("loading video")
    try {
      const added = await ipfs.add(file)
      const url = `https://ipfs.io/ipfs/${added.path}`
      setVideoUrl(url)
      setUploaded1(true)
      console.log("uploaded video")
    } catch (err) {
      console.log('Error uploading the file : ', err)
    }
    setLoading(false)
  }
  const mediaHandler = async (e) => {
    const file = e.target.files[0];
    uploadFile(file);
    // await updateDoc(doc(db, "users", account), {
    //     "thumbNail": thumbNail
    // });
  };
  const videoHandler = async (e) => {
    const file = e.target.files[0];
    uploadVideo(file);
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
      "body": JSON.stringify({ name: name, description: description, file_url: nftUrl, animation_url: videoUrl })
    })
      .then(response => response.json())
      .catch(err => {
        console.error(err);
      });
    const metadataUri = res.metadata_uri
    ethersContract.once("NewVideo", async (a, b, c) => {
      // setTokenId(a.toNumber())
      // console.log(b)
      // console.log(c)
      await setDoc(doc(db, "advertisements", a.toNumber().toString()), {
        "tokenId": a.toNumber(),
        "metadataUri": c,
        "desc": description,
        "title": name,
        "video": videoUrl,
        "thumbnail": nftUrl,
        "owner": account,
        "holders": [],
        "views": [],
      }).then(async () =>
        await updateDoc(doc(db, "merch", "merch"), {
          merch: arrayUnion(account)
        }).then(async () => navigate("/merchDashboard"))
        // navigate("/home")

      )
    })
    await contract.methods.createVideoNFT(metadataUri).send({
      from: window.ethereum.selectedAddress,
      signatureType: biconomy.EIP712_SIGN,
      //optionally you can add other options like gasLimit
    })
    console.log("DONE")
    // console.log(tokenId)
    // tx.on("transactionHash", function (hash) {
    //     console.log(`Transaction hash is ${hash}`);
    //     console.log(`Transaction sent. Waiting for confirmation ..`);
    // }).once("confirmation", function (confirmationNumber, receipt) {
    //     console.log(receipt);
    //     console.log(receipt.transactionHash);
    //     //do something with transaction hash
    // });
    // await addDoc(collection(db, "videos"), {
    //     // "tokenId":
    //     "metadataUri":metadataUri,
    //     "views":[],
    // }).then(() =>
    //     navigate("/home")
    // )
  }
  const handleSubmit = event => {
    event.preventDefault()
    mint(); //get value from input with name of firstName
  };
  return (
    <div className="w-full">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 outline-none" onSubmit={handleSubmit}>
        <TextField
          label='Name'
          value={name}
          id='Name'
          onChange={(e) => setName(e.target.value)}
        />
        <div><label className='mr-10'>NFT</label>
          <input type="file" className="input" onChange={mediaHandler} /></div>
        <div className="p-10 w-full flex items-center justify-center">
          <img alt="" src={nftUrl} className="w-full aspect-video" />
        </div>
        <span>{uploaded ? "Uploaded" : loading ? "Loading..." : ""}</span>
        <div><label className='mr-10'>Video</label>
          <input type="file" className="input" onChange={videoHandler} /></div>
        <div className="p-10 w-full flex items-center justify-center">
          <video
            id="video"
            // ref={onVideo}
            src={videoUrl}
            className="h-full w-full video-js vjs-theme-city"
            controls
            playsInline
          />
        </div>
        <span>{uploaded1 ? "Uploaded" : loading1 ? "Loading..." : ""}</span>
        <div className='mb-4 w-full'>
          <span className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </span>
          <textarea
            className="w-full border-solid border-2 border-grey-100 text-[#b5b5b5] outline-none"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-[#B11414] h-[50px] w-[25%] rounded-2xl my-8 text-white tracking-widest text-xl">
            Cancel
          </button>
          <button type="submit" className="bg-[#b5b5b5] h-[50px] w-[25%] rounded-2xl my-8 text-white tracking-widest text-xl ali hover:bg-[#3f3f3f] hover:text-white">
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

export default NFTForm