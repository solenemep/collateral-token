// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/// @title Collateral Token
/// @author Solène PETTIER
/// @notice Collateral Token is a basic ERC20

contract CollateralToken is ERC20 {
    using Address for address payable;

    address private _reserve;

    constructor(address reserve_, uint256 initialSupply) ERC20("CollateralToken", "CT") {
        _reserve = reserve_;
        _mint(reserve_, initialSupply);
    }

    // getter
    /// @notice the reserve is where all tokens have been minted
    /// @return token owner's address
    function reserve() public view returns (address) {
        return _reserve;
    }
}
