import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

import { ethers } from 'ethers';

const getSelector = ethers.FunctionFragment.getSelector;

enum FacetCutAction {
  Add = 0,
  Replace = 1,
  Remove = 2,
}

const TesserModule = buildModule('TesserModule', (m) => {
  const owner = m.getAccount(0);
  const diamondCut = m.contract('DiamondCutFacet', []);
  const tesseerProxy = m.contract('TesserProxy', [owner, diamondCut], {
    after: [diamondCut],
  });

  const cut = m.contractAt('DiamondCutFacet', tesseerProxy, {
    id: 'DiamondCutFacetAtProxy',
  });

  const diamondLoupeFacet = m.contract('DiamondLoupeFacet', [], {
    after: [tesseerProxy],
  });
  const ownershipFacet = m.contract('OwnershipFacet', [], {
    after: [diamondLoupeFacet],
  });
  const vestingCoreFacet = m.contract('VestingCoreFacet', [], {
    after: [ownershipFacet],
  });
  const vestingMathFacet = m.contract('VestingMathFacet', [], {
    after: [vestingCoreFacet],
  });

  const facetCuts = [
    {
      facetAddress: diamondLoupeFacet,
      action: FacetCutAction.Add,
      functionSelectors: [
        getSelector('facets', []),
        getSelector('facetFunctionSelectors', ['address']),
        getSelector('facetAddresses', []),
        getSelector('facetAddress', ['bytes4']),
        getSelector('supportsInterface', ['bytes4']),
      ],
    },
    {
      facetAddress: ownershipFacet,
      action: FacetCutAction.Add,
      functionSelectors: [
        getSelector('owner', []),
        getSelector('transferOwnership', ['address']),
        getSelector('acceptOwnership', []),
      ],
    },
    {
      facetAddress: vestingCoreFacet,
      action: FacetCutAction.Add,
      functionSelectors: [
        getSelector('createVestingSchedule', [
          'address',
          'uint256',
          'uint256',
          'uint256',
          'uint256',
        ]),
        getSelector('release', ['address', 'uint256']),
        getSelector('getVestingSchedule', ['address']),
      ],
    },
    {
      facetAddress: vestingMathFacet,
      action: FacetCutAction.Add,
      functionSelectors: [
        getSelector('computeVestedAmount', ['uint256', 'uint256', 'uint256']),
        getSelector('computeReleasableAmount', [
          'uint256',
          'uint256',
          'uint256',
        ]),
      ],
    },
  ];

  const tesserInit = m.contract('TesserInit', [], {
    after: [vestingMathFacet],
  });

  const cutCall = m.call(
    cut,
    'diamondCut',
    [
      facetCuts,
      tesserInit,
      m.encodeFunctionCall(tesserInit, 'init', [owner, owner, 500]),
    ],
    {
      after: [tesserInit],
    }
  );

  const tesserToken = m.contract('TesserToken', [owner], { after: [cutCall] });

  return {
    diamondCut,
    tesserInit,
    diamondLoupeFacet,
    ownershipFacet,
    vestingCoreFacet,
    vestingMathFacet,
    tesserToken,
  };
});

// biome-ignore lint/style/noDefaultExport: needed
export default TesserModule;
