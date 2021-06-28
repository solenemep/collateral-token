// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/// @title Token
/// @author Solène PETTIER
/// @notice WrappedEther is a basic ERC20
/// @dev A function to return token owner's address has been added

contract WrappedEther is ERC20 {
    using Address for address payable;

    address private _reserve;

    // Events
    event Deposited(address indexed sender, uint256 amount);
    event Withdrawed(address indexed sender, uint256 amount);

    constructor() ERC20("WrappedEther", "WETH") {}

    // functions
    /// @notice Receive function to directly send ether to switch
    /// @dev Classic receive function calls private _deposit function
    receive() external payable {
        _deposit(msg.sender, msg.value);
    }

    /// @notice Allow users to switch ETH to WETH
    /// @dev Function calls private _deposit function
    function deposit() public payable {
        _deposit(msg.sender, msg.value);
    }

    /// @notice Private function called throught receive and deposit functions
    /// @dev Private function called throught receive and deposit functions
    /// @param sender the one that calls the function
    /// @param value the value sent to switch
    function _deposit(address sender, uint256 value) private {
        _mint(sender, value);
        emit Deposited(sender, value);
    }

    /// @notice Allow user to switch WETH to ETH
    function withdraw(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "WrappedEther : you can not withdraw more than you have");
        _burn(msg.sender, amount);
        payable(msg.sender).sendValue(amount);
        emit Withdrawed(msg.sender, amount);
    }
}
