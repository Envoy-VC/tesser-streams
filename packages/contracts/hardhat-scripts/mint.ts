import hre from 'hardhat';
import { TesserToken__factory } from '../typechain-types';

async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();

  const amount = ethers.parseEther('1000');

  const token = TesserToken__factory.connect(
    '0x8444eC14c268Fc49A8edF4543b92dc846fE8F049',
    deployer
  );

  const tx = await token.mint(deployer.address, amount);
  console.log(tx);
  await tx.wait();

  console.log('Token minted');
}

main();
