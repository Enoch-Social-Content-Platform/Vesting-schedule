// SPDX-License-Identifier: MIT
pragma solidity ^0.5.3;

// import './Vesting.sol';
import '@openzeppelin/upgrades/contracts/upgradeability/ProxyFactory.sol';

contract Vesting_Factory is ProxyFactory {
    // string[] allocationType = ['seed', 'strategic', 'private', 'auction'];
    address public vesting_implementation;
    address[] public vestingProxies;

    constructor(address _vesting_implementation) public {
        vesting_implementation = _vesting_implementation;
    }

    function newVesting(bytes calldata _data) external returns (address) {
        address proxy = deployMinimal(vesting_implementation, _data);
        vestingProxies.push(proxy);
        return proxy;
    }
}