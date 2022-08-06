const { getNamedAccounts, ethers } = require("hardhat")

const main = async () => {
  const { deployer } = getNamedAccounts()
  const FundMe = await ethers.getContract("FundMe", deployer)

  const transactionResponse = await FundMe.withDraw()
  await transactionResponse.wait(1)
  console.log("!withdrawed successfully")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
