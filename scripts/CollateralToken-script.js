/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { deployed } = require('./deployed');

async function main() {
  const INIT_SUPPLY = hre.ethers.utils.parseEther('1000000');

  const [deployer, reserve] = await hre.ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  // We get the contract to deploy
  const CollateralToken = await hre.ethers.getContractFactory('CollateralToken');
  const collateralToken = await CollateralToken.deploy(reserve.address, INIT_SUPPLY);

  await collateralToken.deployed();

  // Afficher l'adresse de déploiement
  await deployed('CollateralToken', hre.network.name, collateralToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
