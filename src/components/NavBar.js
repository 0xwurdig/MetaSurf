import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { db } from '../firebase';
import { InjectedConnector } from "@web3-react/injected-connector";
const Injected = new InjectedConnector({
    supportedChainIds: [80001]
});
const NavBar = () => {
    const { activate } = useWeb3React();
    const { active, account } = useWeb3React();
    return (
        <div>
            <div className="flex h-12 bg-white justify-between items-center px-5">
                <div className="menu flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    {/* <span>LOGO</span> */}
                </div>
                <div className="search flex bg-[#f2f2f2] h-6 max-w-[700px] w-full justify-between items-center text-xs text-[#b5b5b5] p-5 rounded-lg">
                    <span>Search for stream, video or something else..</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <div className="search text-[#b5b5b5] items-center">
                    {!active ? <button className="h-10 px-5 bg-[#3f3f3f] text-white rounded-lg" onClick={() => activate(Injected)}>Connect</button> :
                        <div className="flex items-center justify-between">
                            <div>{account} </div>
                            <div className="w-auto h-[40px] bg-[#b5b5b5] overflow-clip rounded-full ml-2">
                                <img alt="" src="https://www.larvalabs.com/public/images/cryptopunks/punk1385.png" className="h-full object-contain" />
                            </div>
                        </div>}
                </div>
            </div>
        </div>
    )
}
export default NavBar
