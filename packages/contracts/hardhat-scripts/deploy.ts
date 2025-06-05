import hre from 'hardhat';
import {
  DiamondCutFacet__factory,
  DiamondLoupeFacet__factory,
  type IDiamondCut,
  OwnershipFacet__factory,
  TesserInit__factory,
  TesserProxy__factory,
  TesserToken__factory,
  VestingCoreFacet__factory,
  VestingMathFacet__factory,
} from '../typechain-types';

import { encodeFunctionData } from 'viem';

enum FacetCutAction {
  Add = 0,
  Replace = 1,
  Remove = 2,
}

async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  // Deploy DiamondCutFacet
  const diamondCutFacet = await new DiamondCutFacet__factory(deployer).deploy();
  await diamondCutFacet.waitForDeployment();
  const diamondCutFacetAddress = await diamondCutFacet.getAddress();
  console.log('DiamondCutFacet deployed to:', diamondCutFacetAddress);

  // Deploy TesserProxy
  const tesserProxy = await new TesserProxy__factory(deployer).deploy(
    deployer.address,
    diamondCutFacetAddress
  );
  await tesserProxy.waitForDeployment();
  const tesserProxyAddress = await tesserProxy.getAddress();
  console.log('TesserProxy deployed to:', tesserProxyAddress);

  // Deploy DiamondLoupeFacet
  const diamondLoupeFacet = await new DiamondLoupeFacet__factory(
    deployer
  ).deploy();
  await diamondLoupeFacet.waitForDeployment();
  const diamondLoupeFacetAddress = await diamondLoupeFacet.getAddress();
  console.log('DiamondLoupeFacet deployed to:', diamondLoupeFacetAddress);

  // Deploy OwnershipFacet
  const ownershipFacet = await new OwnershipFacet__factory(deployer).deploy();
  await ownershipFacet.waitForDeployment();
  const ownershipFacetAddress = await ownershipFacet.getAddress();
  console.log('OwnershipFacet deployed to:', ownershipFacetAddress);

  // Deploy VestingCoreFacet
  const vestingCoreFacet = await new VestingCoreFacet__factory(
    deployer
  ).deploy();
  await vestingCoreFacet.waitForDeployment();
  const vestingCoreFacetAddress = await vestingCoreFacet.getAddress();
  console.log('VestingCoreFacet deployed to:', vestingCoreFacetAddress);

  // Deploy VestingMathFacet
  const vestingMathFacet = await new VestingMathFacet__factory(
    deployer
  ).deploy();
  await vestingMathFacet.waitForDeployment();
  const vestingMathFacetAddress = await vestingMathFacet.getAddress();
  console.log('VestingMathFacet deployed to:', vestingMathFacetAddress);

  // Deploy TesserToken
  const tesserToken = await new TesserToken__factory(deployer).deploy(
    deployer.address
  );
  await tesserToken.waitForDeployment();
  const tesserTokenAddress = await tesserToken.getAddress();
  console.log('TesserToken deployed to:', tesserTokenAddress);

  console.log(diamondLoupeFacet.interface.getFunction('facets').selector);

  const tesserInit = await new TesserInit__factory(deployer).deploy();
  await tesserInit.waitForDeployment();
  const tesserInitAddress = await tesserInit.getAddress();
  console.log('TesserInit deployed to:', tesserInitAddress);

  const facetCuts: IDiamondCut.FacetCutStruct[] = [
    {
      facetAddress: diamondLoupeFacetAddress,
      action: FacetCutAction.Add,
      functionSelectors: [
        diamondLoupeFacet.interface.getFunction('facets').selector,
        diamondLoupeFacet.interface.getFunction('facetFunctionSelectors')
          .selector,
        diamondLoupeFacet.interface.getFunction('facetAddresses').selector,
        diamondLoupeFacet.interface.getFunction('facetAddress').selector,
        diamondLoupeFacet.interface.getFunction('supportsInterface').selector,
      ],
    },
    {
      facetAddress: ownershipFacetAddress,
      action: FacetCutAction.Add,
      functionSelectors: [
        ownershipFacet.interface.getFunction('owner').selector,
        ownershipFacet.interface.getFunction('transferOwnership').selector,
        ownershipFacet.interface.getFunction('acceptOwnership').selector,
      ],
    },
    {
      facetAddress: vestingCoreFacetAddress,
      action: FacetCutAction.Add,
      functionSelectors: [
        vestingCoreFacet.interface.getFunction('createVestingSchedule')
          .selector,
        vestingCoreFacet.interface.getFunction('release').selector,
        vestingCoreFacet.interface.getFunction('getVestingSchedule').selector,
      ],
    },
    {
      facetAddress: vestingMathFacetAddress,
      action: FacetCutAction.Add,
      functionSelectors: [
        vestingMathFacet.interface.getFunction('computeVestedAmount').selector,
        vestingMathFacet.interface.getFunction('computeReleasableAmount')
          .selector,
      ],
    },
  ];

  const diamondCut = (
    await ethers.getContractAt('DiamondCutFacet', tesserProxyAddress)
  ).connect(deployer);

  const initData = encodeFunctionData({
    abi: [
      {
        type: 'function',
        name: 'init',
        inputs: [
          { name: '_initialOwner', type: 'address', internalType: 'address' },
          { name: '_treasury', type: 'address', internalType: 'address' },
          { name: '_protocolFeeBps', type: 'uint16', internalType: 'uint16' },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
    ],
    functionName: 'init',
    args: [
      deployer.address as `0x${string}`,
      deployer.address as `0x${string}`,
      500,
    ],
  });

  const tx = await diamondCut.diamondCut(
    facetCuts,
    tesserInitAddress,
    initData
  );

  await tx.wait();

  console.log('FacetCut done');
}

main();
