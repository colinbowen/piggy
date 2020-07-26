pragma solidity ^0.6.7;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorInterface.sol";

// MyContract inherits the ChainlinkClient contract to gain the
// functionality of creating Chainlink requests
contract Timelock {
    // Stores the answer from the Chainlink oracle
    AggregatorInterface internal priceFeed;

    address payable public beneficiary;
    uint256 public releaseTime;
    int256 public currentPrice;
    address public owner;

    constructor(address _aggregator) public {
        priceFeed = AggregatorInterface(_aggregator);
        owner = msg.sender;
    }

    function lock(address payable _beneficiary, uint256 _releaseTime) public payable {
        require(
            _releaseTime > block.timestamp,
            "Release time must be set after current block timestamp."
        );
        beneficiary = _beneficiary;
        releaseTime = _releaseTime;

    }

    function release() public {
        require(block.timestamp >= releaseTime);
        payable(beneficiary).transfer(address(this).balance);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int256) {
        return priceFeed.latestAnswer();
    }

    /**
     * Returns the timestamp of the latest price update
     */
    function getLatestPriceTimestamp() public view returns (uint256) {
        return priceFeed.latestTimestamp();
    }

    function balanceOfContract() public view returns (uint256) {
        return address(this).balance;
    }
}
