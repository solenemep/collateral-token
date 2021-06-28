/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('CollateralToken', async function () {
  let CollateralToken, collateralToken, dev, reserve;

  const NAME = 'CollateralToken';
  const SYMBOL = 'CT';
  const INIT_SUPPLY = 10 ** 9;

  beforeEach(async function () {
    [dev, reserve] = await ethers.getSigners();
    CollateralToken = await ethers.getContractFactory('CollateralToken');
    collateralToken = await CollateralToken.connect(dev).deploy(reserve.address, INIT_SUPPLY);
    await collateralToken.deployed();
  });

  describe('Deployment', async function () {
    it(`Should have name ${NAME}`, async function () {
      expect(await collateralToken.name()).to.equal(NAME);
    });
    it(`Should have symbol ${SYMBOL}`, async function () {
      expect(await collateralToken.symbol()).to.equal(SYMBOL);
    });
    it(`Should have reserve set`, async function () {
      expect(await collateralToken.reserve()).to.equal(reserve.address);
    });
    it(`Should have total supply ${INIT_SUPPLY.toString()}`, async function () {
      expect(await collateralToken.totalSupply()).to.equal(INIT_SUPPLY);
    });
    it(`Should mint initial supply ${INIT_SUPPLY.toString()} to reserve`, async function () {
      expect(await collateralToken.balanceOf(reserve.address)).to.equal(INIT_SUPPLY);
    });
  });
});
