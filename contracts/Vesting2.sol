pragma solidity ^0.5.3;

import './SafeMath.sol';
import './Initializable.sol';
import './IERC20.sol';

contract Vesting2 is Initializable {
    using SafeMath for uint256;

    address private _beneficiary;
    // uint256 private _interval = 0;
    uint256 private _intervalPeriod;
    uint256 private _start;
    uint256 private _duration;
    bool private _revocable;

    uint256 lastInterval = 0;
    uint256 totalIntervals;
    
    event TokenReleased(uint256 amount);

    function initialize(address beneficiary, uint256 start, uint256 intervalPeriod, uint256 duration, bool revocable) public initializer {
        require(beneficiary != address(0), "TokenVesting: beneficiary is the zero address");
        
        require(interval <= duration, "TokenVesting: interval is longer than duration");
        require(duration > 0, "TokenVesting: duration is 0");
        
        require(start.add(duration) > block.timestamp, "TokenVesting: final time is before current time");

        require(duration % intervalPeriod == 0, "total duration is not evenly divisible by interval period");

        _beneficiary = beneficiary;
        _revocable = revocable;
        _duration = duration;
        _intervalPeriod = intervalPeriod;
        _start = start;
        totalIntervals = duration/intervalPeriod;
    }

    function beneficiary() public view returns (address) {
        return _beneficiary;
    }

    function interval() public view returns (uint256) {
        return _intervalPeriod;
    }

    function start() public view returns (uint256) {
        return _start;
    }

    function duration() public view returns (uint256) {
        return _duration;
    }

    function revocable() public view returns (bool) {
        return _revocable;
    }

    function release(IERC20 token) public {
        uint256 currentInterval = (block.timestamp - _start)/_intervalPeriod;
        uint256 diff = currentInterval - lastInterval;

        require(diff >= 1, "Tokens are not due yet");

        uint256 currentBalance = token.balanceOf(address(this));
        uint256 releasableAmount = (diff/(totalIntervals - lastInterval))*currentBalance;

        token.transfer(beneficiary(), releasableAmount);
        emit TokenReleased(releasableAmount);
        
        lastInterval = currentInterval;
    }

}