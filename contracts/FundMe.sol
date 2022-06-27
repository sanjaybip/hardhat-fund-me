// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error FundMe__NotOwner();

contract FundMe {
    // Type Declarations
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50 * 1e18;

    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;

    address private immutable i_OWNER;
    AggregatorV3Interface private s_priceFeed;

    modifier onlyOwner() {
        //require(msg.sender == OWNER, "Sender is not owner!");
        //this custom error method saves lots of gas and part of code optimization
        if (msg.sender != i_OWNER) {
            revert FundMe__NotOwner();
        }
        _;
    }

    constructor(address PriceFeed) {
        i_OWNER = msg.sender;
        s_priceFeed = AggregatorV3Interface(PriceFeed);
    }

    // using receive function to get fund directly sent to contracts instead of using fund method

    receive() external payable {
        Fund();
    }

    fallback() external payable {
        Fund();
    }

    function Fund() public payable {
        //msg.value is in term of wei
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "ETH is not enough!"
        );
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public payable onlyOwner {
        // reset the amount funded by each address to 0;
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        //reset the address
        s_funders = new address[](0);

        //withdraw the funds
        // 3 ways to do it
        //1. transfer
        // transfer and send are available to payable type address.
        // msg.sender = is any type address (contract, dead etec)
        // payable(msg.sender) = is a payable address.
        //payable(msg.sender).transfer(address(this).balance); //its throw error and revert the transaction.

        //2. Send
        //bool sendSuccess = payable(msg.sender).send(address(this).balance);
        //require(sendSuccess, "Send Failed, Gas is not sufficient!"); //this is way to revert the transaction if fail.

        //3. call
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Send Failed"); //this is way to revert the transaction if fail.
    }

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders;
        //mapping can't be in memory.
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        //reset the address
        s_funders = new address[](0);

        (bool callSuccess, ) = i_OWNER.call{value: address(this).balance}("");
        require(callSuccess, "Send Failed"); //this is way to revert the transaction if fail.
    }

    function getOwner() public view returns (address) {
        return i_OWNER;
    }

    function getFunders(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }

    function getAddressToAmountFunded(address funder)
        public
        view
        returns (uint256)
    {
        return s_addressToAmountFunded[funder];
    }
}
