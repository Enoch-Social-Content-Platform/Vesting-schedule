const Vesting = artifacts.require("Vesting");
const Vesting_Factory = artifacts.require("Vesting_Factory");

// const Web3 = require('web3');
// for local development
// const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));

// const vestingJson = require('../build/contracts/Vesting.json');


contract("Vesting", (accounts) => {
    let tx1;
    let tx2;
    let tx3;

    it("Vesting contract address should equal vesting_implementation address in Vesting_Factory contract", async () => {
        let vestingInstance = await Vesting.deployed();
        let vestingFactoryInstance = await Vesting_Factory.deployed();
        const vesting_implementation = await vestingFactoryInstance.vesting_implementation();
        assert.equal(vestingInstance.address, vesting_implementation);
    })

    it("should create new vesting schedule", async () => {
        let vestingFactoryInstance = await Vesting_Factory.deployed();
        const start = Math.ceil(Date.now()/1000);

        encodedData1 = encodeInitializeData(accounts[1], start, 1*1*10*60, start + 1*1*30*60);
        encodedData2 = encodeInitializeData(accounts[2], start, 1*24*60*60, start + 3*24*60*60);

        tx1 = await vestingFactoryInstance.newVesting(encodedData1);
        tx2 = await vestingFactoryInstance.newVesting(encodedData2);
        console.log("transaction reciept: ", tx1);
        console.log("transaction reciept: ", tx2);
        assert.ok(tx1, "proxy contract created for vesting");
    })

    it("proxy should successfully delegate function call to implementation contract", async () => {
        const proxyAddress1 = tx1.logs[0].args.proxy;
        await proxyCall(1, proxyAddress1);

        const proxyAddress2 = tx2.logs[0].args.proxy;
        await proxyCall(2, proxyAddress2);
    })

    async function proxyCall(num, proxy_addr) {
        const proxyContract = await Vesting.at(proxy_addr);
        console.log("proxy address: ", proxy_addr);

        const beneficiary = await proxyContract.beneficiary();
        console.log(`${num} proxy beneficiary: `, beneficiary);

        const start = await proxyContract.start();
        console.log(`${num} proxy start: `, start.toString());

        const cliff = await proxyContract.cliff();
        console.log(`${num} proxy cliff: `, cliff.toString());

        const duration = await proxyContract.duration();
        console.log(`${num} proxy duration: `, duration.toString());

        // const msgSender = await proxyContract.msgSender({from: accounts[1]});
        // console.log(`${num} proxy msgSender: `, msgSender);
    }

    function encodeInitializeData(benf, start, cliff, duration) {
        return Vesting.web3.eth.abi.encodeFunctionCall({
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
        },[benf, start, cliff, duration, true]);
    }
})

