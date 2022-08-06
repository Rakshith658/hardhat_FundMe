require("dotenv").config({ path: __dirname + "/.env.example" })

require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  // solidity: '0.8.7',
  solidity: {
    compilers: [{ version: "0.8.7" }, { version: "0.6.6" }],
  },
  defaultNetwork: "hardhat",
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL,
      accounts: [process.env.ACCOUNT_ID],
      chainId: 4,
      blockConfirmations: 6,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "INR",
    outputFile: "gas-reporter.txt",
    noColors: true,
    // coinmarketcap: process.env.COINMARKETCAP_KEY,
    token: "MATIC", // if we deploy on polgan //for moreinfo visit https://www.npmjs.com/package/hardhat-gas-reporter // token and gasPriceApi options example
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
      4: 0, // 4 is a blockchain port number
    },
    user: {
      default: 0,
    },
  },
}
