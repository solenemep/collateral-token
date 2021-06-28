/* eslint-disable comma-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('WrappedEther', async function () {
  let WrappedEther, wrappedEther, dev, alice;

  const NAME = 'WrappedEther';
  const SYMBOL = 'WETH';
  const VALUE = 4;

  beforeEach(async function () {
    [dev, reserve, alice] = await ethers.getSigners();
    WrappedEther = await ethers.getContractFactory('WrappedEther');
    wrappedEther = await WrappedEther.connect(dev).deploy();
    await wrappedEther.deployed();
  });

  describe('Deployment', async function () {
    it(`Should have name ${NAME}`, async function () {
      expect(await wrappedEther.name()).to.equal(NAME);
    });
    it(`Should have symbol ${SYMBOL}`, async function () {
      expect(await wrappedEther.symbol()).to.equal(SYMBOL);
    });
  });
  describe('receive', async function () {
    it('Transfers directly', async function () {
      expect(
        await alice.sendTransaction({ to: wrappedEther.address, value: VALUE, gasPrice: 0 })
      ).to.changeEtherBalance(wrappedEther, VALUE);
    });
  });
  describe('deposit', async function () {
    it('Changes ETH balances', async function () {
      const tx = await wrappedEther.connect(alice).deposit({ value: VALUE, gasPrice: 0 });
      expect(tx).to.changeEtherBalance(alice, -VALUE);
      expect(tx).to.changeEtherBalance(wrappedEther, VALUE);
    });
    it('Changes WETH balances', async function () {
      await wrappedEther.connect(alice).deposit({ value: VALUE, gasPrice: 0 });
      expect(await wrappedEther.balanceOf(alice.address)).to.equal(VALUE);
    });
    it('Emits Deposited event', async function () {
      await expect(wrappedEther.connect(alice).deposit({ value: VALUE, gasPrice: 0 }))
        .to.emit(wrappedEther, 'Deposited')
        .withArgs(alice.address, VALUE);
    });
  });
  describe('withdraw', async function () {
    it('Reverts if balance < amount', async function () {
      await expect(wrappedEther.connect(alice).withdraw(VALUE)).to.be.revertedWith(
        'WrappedEther : you can not withdraw more than you have'
      );
    });
    it('Changes ETH balances', async function () {
      await wrappedEther.connect(alice).deposit({ value: VALUE, gasPrice: 0 });
      const tx = await wrappedEther.connect(alice).withdraw(VALUE);
      expect(tx).to.changeEtherBalance(alice, VALUE);
      expect(tx).to.changeEtherBalance(wrappedEther, -VALUE);
    });
    it('Changes WETH balances', async function () {
      await wrappedEther.connect(alice).deposit({ value: VALUE, gasPrice: 0 });
      await wrappedEther.connect(alice).withdraw(VALUE);
      expect(await wrappedEther.balanceOf(alice.address)).to.equal(0);
    });
    it('Emits Withdrawed event', async function () {
      await wrappedEther.connect(alice).deposit({ value: VALUE, gasPrice: 0 });
      await expect(wrappedEther.connect(alice).withdraw(VALUE / 2))
        .to.emit(wrappedEther, 'Withdrawed')
        .withArgs(alice.address, VALUE / 2);
    });
  });
});
