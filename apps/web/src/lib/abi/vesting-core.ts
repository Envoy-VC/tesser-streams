export const VESTING_CORE_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'SafeERC20FailedOperation',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'vestingId',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'beneficiary',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'feeAmount',
        type: 'uint256',
      },
    ],
    name: 'ScheduleCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'vestingId',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'beneficiary',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'TokensReleased',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'beneficiary',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'totalAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint40',
        name: 'cliffDuration',
        type: 'uint40',
      },
      {
        internalType: 'uint40',
        name: 'vestingDuration',
        type: 'uint40',
      },
      {
        internalType: 'uint256',
        name: 'alpha',
        type: 'uint256',
      },
    ],
    name: 'createVestingSchedule',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'vestingId',
        type: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
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
    name: 'getVestingSchedule',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'beneficiary',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint40',
            name: 'startTime',
            type: 'uint40',
          },
          {
            internalType: 'uint40',
            name: 'cliffDuration',
            type: 'uint40',
          },
          {
            internalType: 'uint40',
            name: 'vestingDuration',
            type: 'uint40',
          },
          {
            internalType: 'uint256',
            name: 'alpha',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'released',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'frozen',
            type: 'bool',
          },
        ],
        internalType: 'struct VestingStorageLib.VestingSchedule',
        name: '',
        type: 'tuple',
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
    name: 'release',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
