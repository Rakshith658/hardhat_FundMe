const {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
} = require('../helper-hardhat-config')
const { network } = require('hardhat')

module.exports = async ({ getNamedAccounts, getChainId, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  if (developmentChains.includes(network.name)) {
    log('deploying the contract to dev env...')
    await deploy('MockV3Aggregator', {
      contract: 'MockV3Aggregator',
      from: deployer,
      args: [DECIMALS, INITIAL_ANSWER], // data to the constructor function in FundMe contract
      log: true,
    })
    log('Mock deployed ')
    log('----------------------------------------------------------')
  }
}

module.exports.tags = ['all', 'mocks']
