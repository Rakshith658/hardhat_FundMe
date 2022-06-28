//SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "./Library.sol";

contract FundMe {
    using priceConverter for uint256;

    address[] public senders;

    uint256 public constant minimumUsd = 1 * 1e18;
    mapping(address => uint256) public addressToValue;

    address public immutable owner;

    constructor() {
        owner = msg.sender;
    }

    function fundme() public payable {
        require(
            priceConverter.getConverstionRate(msg.value) > minimumUsd,
            "don't enough fund"
        );
        senders.push(msg.sender);
        addressToValue[msg.sender] = msg.value;
    }

    function withDraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < senders.length;
            funderIndex++
        ) {
            address senderAddress = senders[funderIndex];
            addressToValue[senderAddress] = 0;
        }
        senders = new address[](0);

        // payable(msg.sender).transfer(address(this).balance);
        // bool snedFail = payable(msg.sender).send(address(this).balance);
        // require(snedFail , "send Failes");

        (bool callSuccess, ) = // bytes memory dataReturn
        payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "call failed");
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "you are not the owner");
        _;
    }

    receive() external payable {
        fundme();
    }

    fallback() external payable {
        fundme();
    }
}
