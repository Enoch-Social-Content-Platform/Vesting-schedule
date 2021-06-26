// SPDX-License-Identifier: MIT
pragma solidity ^0.5.3;

// import './Vesting.sol';
import '@openzeppelin/upgrades/contracts/upgradeability/ProxyFactory.sol';

contract VestingFactory is ProxyFactory {
    // string[] allocationType = ['seed', 'strategic', 'private', 'auction'];
    address public vesting_skeleton;
    address[] public vestingProxies;

    function newVesting(bytes memory _data) external returns (address) {
        address proxy = deployMinimal(vesting_skeleton, _data);
        vestingProxies.push(proxy);
        return proxy;
    }
}