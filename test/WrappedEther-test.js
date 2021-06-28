/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('WrappedEther', async function () {
  let WrappedEther, wrappedEther, dev, reserve;

  const NAME = 'WrappedEther';
  const SYMBOL = 'WETH';
  const INIT_SUPPLY = 10 ** 9;

  beforeEach(async function () {
    [dev, reserve] = await ethers.getSigners();
    WrappedEther = await ethers.getContractFactory('WrappedEther');
    wrappedEther = await WrappedEther.connect(dev).deploy(reserve.address, INIT_SUPPLY);
    await wrappedEther.deployed();
  });

  describe('Deployment', async function () {
    it(`Should have name ${NAME}`, async function () {
      expect(await wrappedEther.name()).to.equal(NAME);
    });
    it(`Should have symbol ${SYMBOL}`, async function () {
      expect(await wrappedEther.symbol()).to.equal(SYMBOL);
    });
    it(`Should have reserve set`, async function () {
      expect(await wrappedEther.reserve()).to.equal(reserve.address);
    });
    it(`Should have total supply ${INIT_SUPPLY.toString()}`, async function () {
      expect(await wrappedEther.totalSupply()).to.equal(INIT_SUPPLY);
    });
    it(`Should mint initial supply ${INIT_SUPPLY.toString()} to reserve`, async function () {
      expect(await wrappedEther.balanceOf(reserve.address)).to.equal(INIT_SUPPLY);
    });
  });
});
