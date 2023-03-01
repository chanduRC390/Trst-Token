const {expect } = require("chai");
const hre = require("hardhat");

describe("Trst contract", function (){
    let Token;
    let Trst;
    let owner;
    let addr1;
    let addr2;
    let tokencap = 10000000;
    let tokenBlockReward= 50;


     beforeEach(async function (){
        Token = await hre.ethers.getContractFactory("Trst");
        [owner,addr1,addr2] = await hre.ethers.getSigners();
        Trst = await Token.deploy(tokencap,tokenBlockReward);

     });
     
     describe("Deployment", function (){
        it("should set the right owner", async function (){
            expect(await Trst.owner()).to.equal(owner.address);
        });
        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await Trst.balanceOf(owner.address);
            expect(await Trst.totalSupply()).to.equal(ownerBalance);
          });
      
          it("Should set the max capped supply to the argument provided during deployment", async function () {
            const cap = await Trst.cap();
            expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(tokencap);
          });
      
          it("Should set the blockreward to the argument provided during deployment", async function () {
            const blockreward = await Trst.blockreward();
            expect(Number(hre.ethers.utils.formatEther(blockreward))).to.equal(tokenBlockReward);
          });
        });
      
        describe("Transactions", function () {
          it("Should transfer tokens between accounts", async function () {
            // Transfer 50 tokens from owner to addr1
            await Trst.transfer(addr1.address, 50);
            const addr1Balance = await Trst.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50);
      
            // Transfer 50 tokens from addr1 to addr2
            // We use .connect(signer) to send a transaction from another account
            await Trst.connect(addr1).transfer(addr2.address, 50);
            const addr2Balance = await Trst.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
          });
      
          it("Should fail if sender doesn't have enough tokens", async function () {
            const initialOwnerBalance = await Trst.balanceOf(owner.address);
            // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
            // `require` will evaluate false and revert the transaction.
            await expect(
                Trst.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      
            // Owner balance shouldn't have changed.
            expect(await Trst.balanceOf(owner.address)).to.equal(
              initialOwnerBalance
            );
          });
      
          it("Should update balances after transfers", async function () {
            const initialOwnerBalance = await Trst.balanceOf(owner.address);
    

            // Transfer 100 tokens from owner to addr1.
            await Trst.transfer(addr1.address, 100);
      
            // Transfer another 50 tokens from owner to addr2.
            await Trst.transfer(addr2.address, 50);
      
            // Check balances.
            const finalOwnerBalance = await Trst.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));
      
            const addr1Balance = await Trst.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);
      
            const addr2Balance = await Trst.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
          });
        });
});