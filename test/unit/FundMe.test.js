const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async () => {
      const { deploy, log, get } = deployments
      let FundMe
      let deployer
      let MockV3Aggregator
      const sendValue = ethers.utils.parseEther("1")
      beforeEach(async () => {
        //   deploying the FundMe Contract to hardhat newtwork
        // ethers.getSigners() will return a list of accounts from hardhat config files
        // networks.rinkeby(newtwork name).accounts for test networks
        // const accounts = await ethers.getSigners()
        // const accountsZero =accounts[0]
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        FundMe = await ethers.getContract("FundMe", deployer)
        MockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        )
      })
      describe("constructor", async () => {
        it(" it should return same address as MockV3Aggregator address", async () => {
          const response = await FundMe.priceFeed()
          assert.equal(response, MockV3Aggregator.address)
        })
      })

      describe("fund", async () => {
        it("it fails if you don't send enough ETH", async () => {
          await expect(FundMe.fundme()).to.be.revertedWith("don't enough fund")
        })

        it("updating the amount funded data structure", async () => {
          await FundMe.fundme({ value: sendValue })
          const response = await FundMe.addressToValue(deployer)
          assert.equal(response.toString(), sendValue.toString())
        })

        it("it should add sender to list", async () => {
          await FundMe.fundme({ value: sendValue })
          const response = await FundMe.senders(0)
          assert.equal(response, deployer)
        })
      })

      describe("withdraw", async () => {
        beforeEach(async () => {
          await FundMe.fundme({ value: sendValue })
        })

        it("withdraw ETH from  single founder", async () => {
          const startingFundMeBalance = await FundMe.provider.getBalance(
            FundMe.address
          )
          const startingDeployerBalance = await FundMe.provider.getBalance(
            deployer
          )

          const transactionResponse = await FundMe.withDraw()
          const transactionReceipt = await transactionResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionReceipt
          const gasCost = gasUsed.mul(effectiveGasPrice)
          const endingFundMeBalance = await FundMe.provider.getBalance(
            FundMe.address
          )

          const endingDeployerBalance = await FundMe.provider.getBalance(
            deployer
          )

          assert.equal(endingFundMeBalance, 0)
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          )
        })

        it("allows us to withdraw funds with multiple accounts", async () => {
          const accounts = await ethers.getSigners()
          for (let i = 0; i < 6; i++) {
            const fundMeConnectedContract = await FundMe.connect(accounts[i])
            await fundMeConnectedContract.fundme({ value: sendValue })
          }
          const startingFundMeBalance = await FundMe.provider.getBalance(
            FundMe.address
          )
          const startingDeployerBalance = await FundMe.provider.getBalance(
            deployer
          )

          const transactionResponse = await FundMe.withDraw()
          const transactionReceipt = await transactionResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionReceipt
          const gasCost = gasUsed.mul(effectiveGasPrice)
          const endingFundMeBalance = await FundMe.provider.getBalance(
            FundMe.address
          )

          const endingDeployerBalance = await FundMe.provider.getBalance(
            deployer
          )

          assert.equal(endingFundMeBalance, 0)
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          )
          await expect(FundMe.senders(0)).to.be.reverted
          for (let i = 0; i < 6; i++) {
            assert.equal(await FundMe.addressToValue(accounts[i].address), 0)
          }
        })
      })

      it("Only allows the owner to withdraw", async () => {
        const accounts = await ethers.getSigners()
        const attackerConnectedContract = await FundMe.connect(accounts[1])
        await expect(attackerConnectedContract.withDraw()).to.be.revertedWith(
          "FundMe__NotOwner"
        )
      })
    })
