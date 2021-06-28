/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
const hre = require('hardhat');
const { deployed } = require('./deployed');
const { getContract } = require('./getContract');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  const collateralTokenAddress = await getContract('CollateralToken', 'kovan');

  // We get the contract to deploy
  const CollateralTokenBacked = await hre.ethers.getContractFactory('CollateralTokenBacked');
  const collateralTokenBacked = await CollateralTokenBacked.deploy(collateralTokenAddress);

  await collateralTokenBacked.deployed();

  // Afficher l'adresse de déploiement
  await deployed('CollateralTokenBacked', hre.network.name, collateralTokenBacked.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
