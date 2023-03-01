//contract/erc20token.sol
//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";


contract Trst is ERC20Capped,ERC20Burnable{
    address payable public owner;
    uint256 public blockreward;
    
    constructor(uint256 cap , uint256 reward) ERC20("Trst","Trst") ERC20Capped(cap *(10 ** decimals())){
        owner = payable(msg.sender);
        _mint(owner, 700 * (10 ** decimals()));
        blockreward = reward * (10 ** decimals());
    }

    function _mint(address account, uint256 amount) internal virtual override (ERC20,ERC20Capped){
        require(ERC20.totalSupply() + amount <= cap(), "ERC20Capped: cap exceeded");
        super._mint(account, amount);
    }
    
    function _mintMinerReward () internal{
        _mint(block.coinbase, blockreward);
    }

    function _beforeTokenTransfer(address from , address to , uint256 value) internal virtual override{
        if(from != address(0)&& to != block.coinbase && block.coinbase != address(0)){
            _mintMinerReward();
        }
        super._beforeTokenTransfer(from,to,value);
    }

    function destroy() public onlyOwner{
        selfdestruct(owner);
    }

    function setBlockreward(uint256 reward) public onlyOwner {
        blockreward = reward * (10 ** decimals());

    }

     modifier onlyOwner {
        require(msg.sender == owner, "only owner can call this function");
        _;
     }
}