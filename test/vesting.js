const Vesting = artifacts.require("Vesting");
const Vesting_Factory = artifacts.require("Vesting_Factory");

const Web3 = require('web3');
// for local development
const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));

// const vestingJson = require('../build/contracts/Vesting.json');


contract("Vesting", (accounts) => {
    let tx;

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
        console.log("beneficiary input: ", accounts[1]);

        tx = await vestingFactoryInstance.newVesting(encodedData);
        console.log("transaction reciept: ", tx);
        assert.ok(tx, "proxy contract created for vesting");
    })

    it("proxy should successfully delegate function call to implementation contract", async () => {
        const proxyAddress = tx.logs[0].args.proxy;
        console.log("proxy address: ", proxyAddress);

        const proxyContract = await Vesting.at(proxyAddress);

        const beneficiary = await proxyContract.beneficiary();
        console.log("proxy beneficiary: ", beneficiary);

        const start = await proxyContract.start();
        console.log("proxy start: ", start.toString());

        const cliff = await proxyContract.cliff();
        console.log("proxy cliff: ", cliff.toString());

        const duration = await proxyContract.duration();
        console.log("proxy duration: ", duration.toString());

        const owner = await proxyContract.owner();
        console.log("owner: ", owner);

        const msgSender = await proxyContract.msgSender({from: accounts[0]});
        console.log("proxy msgSender: ", msgSender);
    })
})

