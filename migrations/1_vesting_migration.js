const Vesting = artifacts.require("Vesting");
const Vesting_Factory = artifacts.require("Vesting_Factory");

module.exports = async function (deployer, network, accounts) {
  const start = Math.ceil(Date.now()/1000);
  await deployer.deploy(Vesting);
  // , accounts[1], start, 3*24*60*60, start + 6*24*60*60, true
  const vestingInstance = await Vesting.deployed();
  await deployer.deploy(Vesting_Factory, vestingInstance.address);
  
  // const vestingFactoryInstance = await Vesting_Factory.deployed();
  // console.log("vesting instance", vestingInstance);
};
