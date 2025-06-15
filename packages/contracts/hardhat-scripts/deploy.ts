import hre from 'hardhat';
import {
  Account__factory,
  DiamondCutFacet__factory,
  DiamondLoupeFacet__factory,
  ERC6551RegistryFacet__factory,
  FractionalStreamNFT__factory,
  type IDiamondCut,
  Marketplace__factory,
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

  // Deploy OwnershipFacet
  const ownershipFacet = await new OwnershipFacet__factory(deployer).deploy();
  await ownershipFacet.waitForDeployment();
  const ownershipFacetAddress = await ownershipFacet.getAddress();
  console.log('OwnershipFacet deployed to:', ownershipFacetAddress);

  // Deploy TesserProxy
  const tesserProxy = await new TesserProxy__factory(deployer).deploy(
    deployer.address,
    diamondCutFacetAddress,
    ownershipFacetAddress
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

  // deploy ERC6551RegistryFacet
  const erc6551RegistryFacet = await new ERC6551RegistryFacet__factory(
    deployer
  ).deploy();
  await erc6551RegistryFacet.waitForDeployment();
  const erc6551RegistryFacetAddress = await erc6551RegistryFacet.getAddress();
  console.log('ERC6551RegistryFacet deployed to:', erc6551RegistryFacetAddress);

  // Deploy TesserToken
  const tesserToken = await new TesserToken__factory(deployer).deploy(
    deployer.address
  );
  await tesserToken.waitForDeployment();
  const tesserTokenAddress = await tesserToken.getAddress();
  console.log('TesserToken deployed to:', tesserTokenAddress);

  // Deploy TesserInit
  const tesserInit = await new TesserInit__factory(deployer).deploy();
  await tesserInit.waitForDeployment();
  const tesserInitAddress = await tesserInit.getAddress();
  console.log('TesserInit deployed to:', tesserInitAddress);

  // Deploy Implementation Contract
  const implementation = await new Account__factory(deployer).deploy();
  await implementation.waitForDeployment();
  const implementationAddress = await implementation.getAddress();
  console.log('Implementation deployed to:', implementationAddress);

  // Deploy FractionalStreamNFT
  const fsNFT = await new FractionalStreamNFT__factory(deployer).deploy(
    deployer.address,
    tesserProxyAddress
  );
  await fsNFT.waitForDeployment();
  const fsNFTAddress = await fsNFT.getAddress();
  console.log('FractionalStreamNFT deployed to:', fsNFTAddress);

  // Deploy Marketplace
  const marketplace = await new Marketplace__factory(deployer).deploy(
    fsNFTAddress,
    tesserProxyAddress,
    0,
    deployer.address
  );
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log('Marketplace deployed to:', marketplaceAddress);

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
      facetAddress: vestingCoreFacetAddress,
      action: FacetCutAction.Add,
      functionSelectors: [
        vestingCoreFacet.interface.getFunction('createVestingSchedule')
          .selector,
        vestingCoreFacet.interface.getFunction('release').selector,
        vestingCoreFacet.interface.getFunction('getVestingSchedule').selector,
        vestingCoreFacet.interface.getFunction('getBeneficiaryForVestingId')
          .selector,
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
    {
      facetAddress: erc6551RegistryFacetAddress,
      action: FacetCutAction.Add,
      functionSelectors: [
        erc6551RegistryFacet.interface.getFunction('createAccount').selector,
        erc6551RegistryFacet.interface.getFunction('account').selector,
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
          {
            internalType: 'address',
            name: '_treasury',
            type: 'address',
          },
          {
            internalType: 'uint16',
            name: '_protocolFeeBps',
            type: 'uint16',
          },
          {
            internalType: 'address',
            name: '_initialImplementation',
            type: 'address',
          },
          {
            internalType: 'address',
            name: '_fractionalStreamNFT',
            type: 'address',
          },
        ],
        outputs: [],
        stateMutability: 'nonpayable',
      },
    ],
    functionName: 'init',
    args: [
      deployer.address as `0x${string}`,
      10,
      implementationAddress as `0x${string}`,
      fsNFTAddress as `0x${string}`,
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
