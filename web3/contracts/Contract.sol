// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Charitycampaign {

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
}