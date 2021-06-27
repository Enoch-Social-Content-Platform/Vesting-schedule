const Vesting = artifacts.require("Vesting");
const Vesting_Factory = artifacts.require("Vesting_Factory");
// const { assert } = require('asser');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));

contract("Vesting", (accounts) => {
    it("Vesting contract address should equal vesting_implementation address in Vesting_Factory contract", async () => {
        let vestingInstance = await Vesting.deployed();
        let vestingFactoryInstance = await Vesting_Factory.deployed();
        const vesting_implementation = await vestingFactoryInstance.vesting_implementation();
        assert.equal(vestingInstance.address, vesting_implementation);
    })

    it("should create new vesting schedule", async () => {
        let vestingFactoryInstance = await Vesting_Factory.deployed();
        const start = Math.ceil(Date.now()/1000);
        encodedData = web3.eth.abi.encodeFunctionCall({
            name: 'initialize',
            type: 'function',
            inputs: [{
                type: 'address',
                name: 'beneficiary'
            },{
                type: 'uint256',
                name: 'start'
            },{
                type: 'uint256',
                name: 'cliffDuration'
            },{
                type: 'uint256',
                name: 'duration'
            },{
                type: 'bool',
                name: 'revocable'
            }]
        }, [accounts[0], start, 3*24*60*60, start + 6*24*60*60, true]);

        let proxy = await vestingFactoryInstance.newVesting(encodedData);
        console.log(proxy);
    })
})

