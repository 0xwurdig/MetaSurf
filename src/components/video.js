export const VideoTiles = () => {
    return (
        <div className="mr-10 w-[22vw]">
            <img alt="" src="/newYork.jpg" />
            <div className="flex justify-between items-center mt-2">
                <div className="w-[70%] h-auto">
                    <p className="text-lg text-ellipsis overflow-hidden">My new travel in</p>
                    <p className="text-[#b5b5b5] text-xs text-ellipsis overflow-hidden">0x8BC09eEE30b7f6E620C7f3a89bc131B381cA0523</p>
                </div>
                <div className="w-auto h-12 bg-[#b5b5b5] overflow-clip rounded-full">
                    <img alt="" src="https://www.larvalabs.com/public/images/cryptopunks/punk1385.png" className="h-full object-contain" />
                </div>
            </div>
        </div>
    )
}