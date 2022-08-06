const { assert } = require("chai")
const { getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe staging test", async () => {
      let deployer
      let FundMe
      const sendValue = ethers.utils.parseEther("1")
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        FundMe = await ethers.getContract("FundMe", deployer)
      })
      it("allows with people to fund and withdraw", async () => {
        await FundMe.fundme({ value: sendValue })
        await FundMe.withDraw()
        const endingFundBalance = await FundMe.provider.getBalance(
          FundMe.address
        )
        assert.equal(endingFundBalance.toString(), "0")
      })
    })
