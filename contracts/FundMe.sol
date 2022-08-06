//SPDX-License-Identifier: MIT

//pragma
pragma solidity 0.8.7;

// imports
import "./Library.sol";

// error code
error FundMe__NotOwner();

/// @title A contract for the funding
/// @author Rakshith kumar s
/// @notice this contract is to demo the smaple funding contract
contract FundMe {
  using PriceConverter for uint256;

  address[] public senders;

  uint256 public constant MINIMUN_USD = 1 * 1e18;
  mapping(address => uint256) public addressToValue;

  address public immutable owner;

  AggregatorV3Interface public priceFeed;

  constructor(address priceFeedAddress) {
    owner = msg.sender;
    priceFeed = AggregatorV3Interface(priceFeedAddress);
  }

  // modifier are used to check the prerequisites for the function
  // if it contains all the prerequisites, then it will the function
  // else it will throw the error
  // modifier onlyOwner() {
  //   if (msg.sender == owner) revert FundMe_NotOwner();
  //   _;
  //   // require(msg.sender == owner, "you are not the owner");
  //   // _; // _ is used to continue the th function
  // }
  modifier onlyOwner() {
    // require(msg.sender == i_owner);
    if (msg.sender != owner) revert FundMe__NotOwner();
    _;
  }

  function fundme() public payable {
    require(
      PriceConverter.getConverstionRate(msg.value, priceFeed) > MINIMUN_USD,
      "don't enough fund"
    );
    senders.push(msg.sender);
    addressToValue[msg.sender] = msg.value;
  }

  function withDraw() public onlyOwner {
    for (uint256 funderIndex = 0; funderIndex < senders.length; funderIndex++) {
      address senderAddress = senders[funderIndex];
      addressToValue[senderAddress] = 0;
    }
    senders = new address[](0);

    // payable(msg.sender).transfer(address(this).balance);
    // bool snedFail = payable(msg.sender).send(address(this).balance);
    // require(snedFail , "send Failes");

    (
      bool callSuccess, // bytes memory dataReturn

    ) = payable(msg.sender).call{value: address(this).balance}("");
    require(callSuccess, "call failed");
  }

  receive() external payable {
    fundme();
  }

  fallback() external payable {
    fundme();
  }
}
