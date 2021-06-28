const Vesting = artifacts.require("Vesting");
const Vesting_Factory = artifacts.require("Vesting_Factory");

const Web3 = require('web3');
// for local development
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));

const vestingJson = require('../build/contracts/Vesting.json');


contract("Vesting", (accounts) => {
    let proxy;

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
        }, [accounts[1], start, 3*24*60*60, start + 6*24*60*60, true]);

        proxy = await vestingFactoryInstance.newVesting(encodedData);
        console.log(proxy);
        assert.ok(proxy, "proxy contract created for vesting");
    })

    it("proxy should successfully delegate function call to implementation contract", async () => {
        // const proxyContract = new web3.eth.Contract(vestingJson.abi, proxy.logs[0].address);
        const proxyContract = await Vesting.at(proxy.logs[0].args.proxy);
        const beneficiary = await proxyContract.beneficiary();
        console.log(beneficiary);
    })

    // it("test", async () => {
    //     const start = Math.ceil(Date.now()/1000);
    //     encodedData = web3.eth.abi.encodeFunctionCall({
    //         name: 'initialize',
    //         type: 'function',
    //         inputs: [{
    //             type: 'address',
    //             name: 'beneficiary'
    //         },{
    //             type: 'uint256',
    //             name: 'start'
    //         },{
    //             type: 'uint256',
    //             name: 'cliffDuration'
    //         },{
    //             type: 'uint256',
    //             name: 'duration'
    //         },{
    //             type: 'bool',
    //             name: 'revocable'
    //         }]
    //     }, [accounts[1], start, 3*24*60*60, start + 6*24*60*60, true]);

    //     const implementation = await Vesting.new();
    //     const factory = await Vesting_Factory.new(implementation.address);
    //     const tx = await factory.newVesting(encodedData);
    //     const proxyaddress = tx.logs[0].args.proxy;
    //     console.log(tx.logs[0].address, proxyaddress);
    // })
})

