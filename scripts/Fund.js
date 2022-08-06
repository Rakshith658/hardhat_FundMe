const { getNamedAccounts, ethers } = require("hardhat")

const main = async () => {
  const { deployer } = getNamedAccounts()
  const FundMe = await ethers.getContract("FundMe", deployer)
  console.log("Funding the contract")
  const transactionResponse = await FundMe.fundme({
    value: ethers.utils.parseEther("0.1"),
  })
  await transactionResponse.wait(1)
  console.log("!Funded")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
