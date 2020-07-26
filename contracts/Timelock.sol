pragma solidity ^0.6.7;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorInterface.sol";

// MyContract inherits the ChainlinkClient contract to gain the
// functionality of creating Chainlink requests
contract Timelock {
    // Stores the answer from the Chainlink oracle
    AggregatorInterface internal priceFeed;

    address payable public beneficiary;
    bool public locked;
    uint256 public releaseTime;
    int256 public currentPrice;
    address public owner;

    constructor(address _aggregator) public {
        priceFeed = AggregatorInterface(_aggregator);
        owner = msg.sender;
        locked = false;
    }

    function lock(uint256 _releaseTime) public {
        require(
            _releaseTime > block.timestamp,
            "Release time must be set after current block timestamp."
        );
        require(address(this).balance > 0, "Must have a balance");
        releaseTime = _releaseTime;
        locked = true;
    }

    function deposit() external payable {
        // beneficiary = _beneficiary;
        // beneficiary = msg.sender;
    }

    function release() public {
        require(block.timestamp >= releaseTime);
        payable(beneficiary).transfer(address(this).balance);
        locked = false;
    }

    function lockStatus() public view returns (bool) {
        return locked;
    }

    function getReleaseTime() public view returns (uint256) {
        return releaseTime;
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

    function balance() public view returns (uint256) {
        return address(this).balance;
    }
}
