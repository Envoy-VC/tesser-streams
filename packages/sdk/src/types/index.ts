import type { Address, Hex } from 'viem';

export type CreateVestingScheduleParams = {
  beneficiary: Address;
  tokenAddress: Address;
  totalAmount: bigint;
  cliffDuration: number;
  vestingDuration: number;
  alpha: bigint;
};

export type GetVestingScheduleParams = {
  vestingId: Hex;
};

export type ApproveTokenParams = {
  spender: Address;
  value: bigint;
};

export type GetAllowanceParams = {
  owner: Address;
  spender: Address;
};
