const hre = require('hardhat')

async function verify(contractAddress, args) {
  try {
    console.log('verifying Contract.......')
    await hre.run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (error) {
    if (error.message.toLowerCase().includes('already verified')) {
      console.log(error.message)
    } else {
      console.log(error)
    }
  }
}

module.exports = {
  verify,
}
