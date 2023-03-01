
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
const Trst = await hre.ethers.getContractFactory("Trst");
const trst = await Trst.deploy(1000000,50);


await trst.deployed();
console.log("trst Token address :", trst.address);
console.log("Deploying contracts with the account:", deployer.address);

console.log("Account balance:", (await deployer.getBalance()).toString());


  
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
