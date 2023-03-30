// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract Greetings is ERC2771Context {
    constructor(
        address trustedForwarderAddress
    ) ERC2771Context(trustedForwarderAddress) {}

    uint256 public number = 0;
    address public lastCaller;

    function getNumber() public view returns (uint256) {
        return number;
    }

    function getLastCaller() public view returns (address) {
        return lastCaller;
    }

    function updateNumber(uint256 num) public {
        lastCaller = _msgSender();
        number = num;
    }
}
