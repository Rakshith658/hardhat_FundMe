// async function deploy() {
//   console.log("hi Rakshith kumar s");
// }

// module.exports.default = deploy;

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../Utils/verify")

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = await getChainId()

  let address // AggregatorV3Interface address
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await get("MockV3Aggregator")
    address = ethUsdAggregator.address
  } else {
    address = networkConfig[chainId].ethUsedPriceFeed
  }
  // ["ethUsedPriceFeed"]
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [/*address*/ address], // data to the constructor function in FundMe contract
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  console.log(fundMe.address)
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    // await fundMe.deployTransaction.wait(5)
    await verify(fundMe.address, [address])
  }

  log("----------------------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
