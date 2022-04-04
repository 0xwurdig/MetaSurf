//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@opengsn/contracts/src/BaseRelayRecipient.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract YC1 is VRFConsumerBase, BaseRelayRecipient {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => address) public nft;
    mapping(address => mapping(uint256 => uint256)) private rewards;
    mapping(uint256 => uint256) public nftBalances;
    mapping(address => uint256) public addressBalance;
    mapping(uint256 => string) private _tokenURIs;
    mapping(bytes32 => address) public requestIdToAddress;

    event NewVideo(uint256 id, address owner, string tokenURI);
    event NewTip(uint256 amount, uint256 tokenId);
    event NewWithdraw(address user, uint256 amount);
    event NewRandomNumber(address user, uint256 randomResult);

    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;

    constructor()
        VRFConsumerBase(
            0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, // VRF Coordinator
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB // LINK Token
        )
    {
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 0.0001 * 10**18; // 0.1 LINK (Varies by network)
    }

    function getRandomNumber() public returns (bytes32 requestId) {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill contract with faucet"
        );
        bytes32 requestId = requestRandomness(keyHash, fee);
        requestIdToAddress[requestId] = _msgSender();
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        emit NewRandomNumber(requestIdToAddress[requestId], randomness);
        randomResult = randomness;
    }

    function setTrustedForwarder(address _trustedForwarder) public {
        _setTrustedForwarder(_trustedForwarder);
    }

    /**
     * return the sender of this call.
     * if the call came through our trusted forwarder, return the original sender.
     * otherwise, return `msg.sender`.
     * should be used in the contract anywhere instead of msg.sender
     */
    function versionRecipient() external view override returns (string memory) {
        return "1";
    }

    function createVideoNFT(string calldata tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newNFTId = _tokenIds.current();
        nft[newNFTId] = _msgSender();
        _tokenURIs[newNFTId] = tokenURI;
        nftBalances[newNFTId] = 0;
        emit NewVideo(newNFTId, nft[newNFTId], tokenURI);
        return newNFTId;
    }

    function tip(uint256 _tokenId) public payable {
        nftBalances[_tokenId] += msg.value;
        emit NewTip(msg.value, _tokenId);
    }

    function withdraw() public {
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            _sendFunds(payable(nft[i]), nftBalances[i]);
            nftBalances[i] -= nftBalances[i];
        }
    }

    function getTips(uint256 _tokenId) public returns (uint256) {
        return nftBalances[_tokenId];
    }

    function mintAdNFT(uint256 _tokenId) public {
        rewards[_msgSender()][_tokenId] += 1;
    }

    function airDrop(address payable addr) external payable {
        // require (address.this(balance)>= amount);
        _sendFunds(addr, msg.value);
    }

    function _sendFunds(address payable _recipient, uint256 _amount) private {
        require(
            address(this).balance >= _amount,
            "Insufficient balance for send"
        );
        (bool success, ) = _recipient.call{value: _amount}("");
        require(success, "Unable to send value: recipient may have reverted");
    }
}
