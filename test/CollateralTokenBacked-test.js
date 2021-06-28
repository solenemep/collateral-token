/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('CollateralTokenBacked', async function () {
  let CollateralTokenBacked, collateralTokenBacked, CollateralToken, collateralToken, dev, reserve, alice;

  const NAME = 'CollateralTokenBacked';
  const SYMBOL = 'CTB';
  const INIT_SUPPLY = 10 ** 9;
  const VALUE = 4;

  beforeEach(async function () {
    [dev, reserve, alice] = await ethers.getSigners();
    CollateralToken = await ethers.getContractFactory('CollateralToken');
    collateralToken = await CollateralToken.connect(dev).deploy(reserve.address, INIT_SUPPLY);
    await collateralToken.deployed();
    CollateralTokenBacked = await ethers.getContractFactory('CollateralTokenBacked');
    collateralTokenBacked = await CollateralTokenBacked.connect(dev).deploy(collateralToken.address);
    await collateralTokenBacked.deployed();
  });

  describe('Deployment', async function () {
    it(`Should have name ${NAME}`, async function () {
      expect(await collateralTokenBacked.name()).to.equal(NAME);
    });
    it(`Should have symbol ${SYMBOL}`, async function () {
      expect(await collateralTokenBacked.symbol()).to.equal(SYMBOL);
    });
    it(`Should have Collateral Token address set`, async function () {
      expect(await collateralTokenBacked.collateralToken()).to.equal(collateralToken.address);
    });
  });

  describe('Functions', async function () {
    beforeEach(async function () {
      await collateralToken.connect(reserve).transfer(alice.address, INIT_SUPPLY);
      await collateralToken.connect(alice).approve(collateralTokenBacked.address, INIT_SUPPLY);
    });
    describe('Deposit', async function () {
      it('Reverts if balance < value', async function () {
        await expect(collateralTokenBacked.connect(alice).deposit(INIT_SUPPLY + VALUE)).to.be.revertedWith(
          'CollateralTokenBacked : you do not have enought CT'
        );
      });
      it('Changes CT balances', async function () {
        await collateralTokenBacked.connect(alice).deposit(VALUE);
        expect(await collateralToken.balanceOf(alice.address)).to.equal(INIT_SUPPLY - VALUE);
        expect(await collateralToken.balanceOf(collateralTokenBacked.address)).to.equal(VALUE);
      });
      it('Changes CTB balances', async function () {
        await collateralTokenBacked.connect(alice).deposit(VALUE);
        expect(await collateralTokenBacked.balanceOf(alice.address)).to.equal(VALUE / 2);
      });
      it('Emits Deposited event', async function () {
        await expect(collateralTokenBacked.connect(alice).deposit(VALUE))
          .to.emit(collateralTokenBacked, 'Deposited')
          .withArgs(alice.address, VALUE);
      });
    });
    describe('Withdraw', async function () {
      it('Reverts if balance < value / 2', async function () {
        await expect(collateralTokenBacked.connect(alice).withdraw(VALUE)).to.be.revertedWith(
          'CollateralTokenBacked : you can not withdraw more than you have'
        );
      });
      it('Changes CT balances', async function () {
        await collateralTokenBacked.connect(alice).deposit(VALUE);
        await collateralTokenBacked.connect(alice).withdraw(VALUE);
        expect(await collateralToken.balanceOf(alice.address)).to.equal(INIT_SUPPLY);
        expect(await collateralToken.balanceOf(collateralTokenBacked.address)).to.equal(0);
      });
      it('Changes CTB balances', async function () {
        await collateralTokenBacked.connect(alice).deposit(VALUE);
        await collateralTokenBacked.connect(alice).withdraw(VALUE);
        expect(await collateralTokenBacked.balanceOf(alice.address)).to.equal(0);
      });
      it('Emits Withdrawed event', async function () {
        await collateralTokenBacked.connect(alice).deposit(VALUE);
        await expect(collateralTokenBacked.connect(alice).withdraw(VALUE))
          .to.emit(collateralTokenBacked, 'Withdrawed')
          .withArgs(alice.address, VALUE);
      });
    });
  });
});
