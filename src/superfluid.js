import React, { useState, useEffect } from "react";
import { Framework } from "@superfluid-finance/sdk-core";

import { ethers } from "ethers";



export async function deleteFlow(sender, recipient) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const sf = await Framework.create({
        networkName: "Mumbai",
        provider: provider
    });



    const MATICx = "0x96B82B65ACF7072eFEb00502F45757F254c2a0D4";


    try {
        const deleteFlowOperation = sf.cfaV1.deleteFlow({
            sender: sender,
            receiver: recipient,
            superToken: MATICx

        });

        console.log("Deleting your stream...");

        await deleteFlowOperation.exec(signer);

        console.log(
            `Congrats - you've just deleted your money stream!
         Network: Kovan
         Super Token: DAIx
         Sender: ${sender}
         Receiver: ${recipient}
      `
        );
    } catch (error) {
        console.error(error);
    }
}
//Superfluid logic
export async function createNewFlow(recipient, sender, flowRate) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const sf = await Framework.create({
        chainId: Number(chainId),
        provider: provider
    });

    const MATICx = "0x96B82B65ACF7072eFEb00502F45757F254c2a0D4";


    const maticx = await sf.loadSuperToken("0x96B82B65ACF7072eFEb00502F45757F254c2a0D4");
    console.log('maticx', maticx)

    try {
        const createFlowOperation = sf.cfaV1.createFlow({
            receiver: recipient,
            flowRate: flowRate,
            superToken: MATICx

        });

        console.log("Creating your stream...");

        const result = await createFlowOperation.exec(signer);
        console.log(result);

        console.log(
            `Congrats - you've just created a money stream!
    View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
    Network: Mumbai
    Super Token: MATICx
    Sender: ${sender}
    Receiver: ${recipient},
    FlowRate: ${flowRate}
    `
        );
        return true
    } catch (error) {
        console.log(
            "your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
        );
        console.error(error);
        return false
    }
}

// export const CreateFlow = () => {
//     // const [recipient, setRecipient] = useState("");
//     // const [isButtonLoading, setIsButtonLoading] = useState(false);
//     // const [flowRate, setFlowRate] = useState("");
//     // const [flowRateDisplay, setFlowRateDisplay] = useState("");
//     const [currentAccount, setCurrentAccount] = useState("");

//     const connectWallet = async () => {
//         try {
//             const { ethereum } = window;

//             if (!ethereum) {
//                 alert("Get MetaMask!");
//                 return;
//             }
//             const accounts = await ethereum.request({
//                 method: "eth_requestAccounts"
//             });
//             console.log("Connected", accounts[0]);
//             setCurrentAccount(accounts[0]);
//             // let account = currentAccount;
//             // Setup listener! This is for the case where a user comes to our site
//             // and connected their wallet for the first time.
//             // setupEventListener()
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const checkIfWalletIsConnected = async () => {
//         const { ethereum } = window;

//         if (!ethereum) {
//             console.log("Make sure you have metamask!");
//             return;
//         } else {
//             console.log("We have the ethereum object", ethereum);
//         }

//         const accounts = await ethereum.request({ method: "eth_accounts" });
//         const chain = await window.ethereum.request({ method: "eth_chainId" });

//         if (accounts.length !== 0) {
//             const account = accounts[0];
//             console.log("Found an authorized account:", account);
//             setCurrentAccount(account);
//             // Setup listener! This is for the case where a user comes to our site
//             // and ALREADY had their wallet connected + authorized.
//             // setupEventListener()
//         } else {
//             console.log("No authorized account found");
//         }
//     };

//     useEffect(() => {
//         checkIfWalletIsConnected();
//     }, []);

//     function calculateFlowRate(amount) {
//         if (typeof Number(amount) !== "number" || isNaN(Number(amount)) === true) {
//             alert("You can only calculate a flowRate based on a number");
//             return;
//         } else if (typeof Number(amount) === "number") {
//             if (Number(amount) === 0) {
//                 return 0;
//             }
//             const amountInWei = ethers.BigNumber.from(amount);
//             const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
//             const calculatedFlowRate = monthlyAmount * 3600 * 24 * 30;
//             return calculatedFlowRate;
//         }
//     }

//     const recipient = '0x6c4973970277c8c5c6bE0Fa0c069e184cbB3353A'; // change recipient address to your preferred address
//     const sender = currentAccount;
//     const flowRate = 1;

//     return (
//         <div>
//             <button
//                 onClick={() => connectWallet()}
//                 className='text-white m-20 p-4 bg-black'>
//                 {currentAccount || "Add Wallet"}
//             </button>
//             <br />
//             <button
//                 onClick={() => createNewFlow(recipient, flowRate)}
//                 className='text-white m-20 p-4 bg-sky-500'>
//                 start
//             </button>
//             <button
//                 onClick={() => deleteFlow(sender, recipient, flowRate)}
//                 className='text-white m-20 p-4 bg-sky-500'>
//                 delete
//             </button>
//         </div>
//     );
// };