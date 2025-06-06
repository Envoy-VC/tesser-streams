export const VESTING_MATH_ABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'x',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'y',
        type: 'uint256',
      },
    ],
    name: 'PRBMath_MulDiv18_Overflow',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'UD60x18',
        name: 'x',
        type: 'uint256',
      },
    ],
    name: 'PRBMath_UD60x18_Exp2_InputTooBig',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'UD60x18',
        name: 'x',
        type: 'uint256',
      },
    ],
    name: 'PRBMath_UD60x18_Log_InputTooSmall',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'vestingId',
        type: 'bytes32',
      },
    ],
    name: 'computeReleasableAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'vestingId',
        type: 'bytes32',
      },
    ],
    name: 'computeVestedAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
