import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const TesserModule = buildModule('TesserModule', (m) => {
  const diamondCut = m.contract('DiamondCutFacet', []);
  return { diamondCut };
});

// biome-ignore lint/style/noDefaultExport: needed
export default TesserModule;
