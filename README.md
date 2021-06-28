# Vesting-schedule
smart contracts implementing vesting schedule for fund distribution

## Vesting

The vesting contracts implements the vesting schedule for different funds. It will lock the tokens for a certain period of time. Once the locked period is completed, it will distribute the tokens to the concerned addresses of the developers.

The vesting contracts are designed such that one contract is created for one beneficiary address. This inevitably means that there should be many vesting contracts created in future as new beneficiaries come into picture. The problem with this design is that deploying so many contracts will cause significant amount of gas fees.

## Minimal Proxy

To tackle this problem, we are using minimal proxy pattern with a factory contract to produce clone of the main vesting contract with varying state variables. This is an EIP1167 implementation.

An initial vesting contract, referred to as implementation contract, will be deployed. Then a factory contract will be deployed which will create clones of the vesting contract. 
These clones will vest the tokens and release it to the beneficiary over the period of specified duration. The function call of the clones will be delegated to the implementation contract which was deployed earlier.