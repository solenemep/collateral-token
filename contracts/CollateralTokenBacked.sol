// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./CollateralToken.sol";

/// @title Collateral Token Backed
/// @author Solène PETTIER
/// @notice Collateral Token Backed is a basic ERC20

contract CollateralTokenBacked is ERC20 {
    using Address for address payable;

    // State variables
    CollateralToken private _collateralToken;

    // Events
    event Deposited(address indexed sender, uint256 amount);
    event Withdrawed(address indexed sender, uint256 amount);

    constructor(address collateralTokenAddress) ERC20("CollateralTokenBacked", "CTB") {
        _collateralToken = CollateralToken(collateralTokenAddress);
    }

    /// @notice Private function called throught receive and deposit functions
    /// @dev Private function called throught receive and deposit functions
    /// @param value the value sent to switch
    function deposit(uint256 value) public {
        require(_collateralToken.balanceOf(msg.sender) >= value, "CollateralTokenBacked : you do not have enought CT");
        _collateralToken.transferFrom(msg.sender, address(this), value);
        _mint(msg.sender, value / 2);
        emit Deposited(msg.sender, value);
    }

    /// @notice Allow user to switch WETH to ETH
    function withdraw(uint256 value) public {
        require(balanceOf(msg.sender) >= value / 2, "CollateralTokenBacked : you can not withdraw more than you have");
        _collateralToken.transfer(msg.sender, value);
        _burn(msg.sender, value / 2);
        emit Withdrawed(msg.sender, value);
    }

    // getters
    /// @notice Allow user to get Collateral Token address
    /// @dev Function is a getter to return Collateral Token address
    /// @return _token Token
    function collateralToken() public view returns (CollateralToken) {
        return _collateralToken;
    }
}
