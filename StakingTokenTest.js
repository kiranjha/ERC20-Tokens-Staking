const {expect} = require("chai");
const {ethers} = require("hardhat");
//const { HARDHAT_NETWORK_RESET_EVENT } = require("hardhat/internal/constants");
describe("DEPLOYMENT",function(){
    it("Set the Constructor with owner address and Total Supply",async function(){
        const [owner] = await ethers.getSigners();
        console.log("Signer object : ",owner);
        const Staking = await ethers.getContractFactory("StakingToken");
        const totalSupply = 10*1000**18; 
        const hardhatToken = await Staking.deploy(owner.address,2000);
        console.log(owner.address);
        expect(await hardhatToken.owner()).to.equal(owner.address);
        expect(await hardhatToken.balanceOf(owner.address)).to.equal(2000);
    });

    it("Transfer tokens from Owner account to User account",async function(){
        const [owner,addr1,addr2] = await ethers.getSigners();
        const Staking = await ethers.getContractFactory("StakingToken");
        const hardhatToken = await Staking.deploy(owner.address,2000);

        //Transfer 300 tokens from owner to addr1
        await hardhatToken.transfer(addr1.address,300);
        expect(await hardhatToken.balanceOf(addr1.address)).to.equal(300);
        console.log("User1 Address :- ",addr1.address);
        console.log(await hardhatToken.balanceOf(addr1.address));

        //Transfer 400 tokens from owner to addr2
        await hardhatToken.transfer(addr2.address,400);
        expect(await hardhatToken.balanceOf(addr2.address)).to.equal(400);
        console.log("User2 Address :- ",addr2.address);
        console.log(await hardhatToken.balanceOf(addr2.address));
    });
    it("Creats Stake",async function(){
        const [owner,addr1,addr2] = await ethers.getSigners();
        const Staking = await ethers.getContractFactory("StakingToken");
        const hardhatToken = await Staking.deploy(owner.address,2000);

        //Create Stake of 200 for addr1
        await hardhatToken.transfer(addr1.address,300);
        await hardhatToken.connect(addr1).createStake(200);
        expect(await hardhatToken.stakeOf(addr1.address)).to.equal(200);
        expect(await hardhatToken.balanceOf(addr1.address)).to.equal(100);
        expect(await hardhatToken.totalStakes()).to.equal(200);
        expect(await hardhatToken.totalSupply()).to.equal(2000-200);
    });
    it("Distribute Rewards",async function(){
        const [owner,addr1,addr2] = await ethers.getSigners();
        const Staking = await ethers.getContractFactory("StakingToken");
        const hardhatToken = await Staking.deploy(owner.address,2000);

        await hardhatToken.transfer(addr1.address,300);
        await hardhatToken.connect(addr1).createStake(200);
        
        //rewards are distributed by owner
        await hardhatToken.distributeRewards();
        expect(await hardhatToken.rewardOf(addr1.address)).to.equal(hardhatToken.calculateReward(addr1.address));
        expect(await hardhatToken.totalRewards()).to.equal(hardhatToken.calculateReward(addr1.address));

    });
});

//Owner address :-  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
//addr1 address :-  0x70997970C51812dc3A010C7d01b50e0d17dc79C8
//addr2 address :-  0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
