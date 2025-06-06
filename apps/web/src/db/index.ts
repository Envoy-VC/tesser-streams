import Dexie, { type EntityTable } from 'dexie';

export interface VestingSchedule {
  vestingId: string;
  beneficiary: string;
  token: string;
  totalAmount: bigint;
  feeAmount: bigint;
  cliffDuration: number;
  vestingDuration: number;
  alpha: number;
  startAt: number;
}

export interface ReleaseTransaction {
  vestingId: string;
  amount: bigint;
  transactionHash: string;
  timestamp: number;
}

const db = new Dexie('TesserDB') as Dexie & {
  schedules: EntityTable<VestingSchedule, 'vestingId'>;
  releases: EntityTable<ReleaseTransaction, 'vestingId'>;
};

db.version(1).stores({
  schedules: 'vestingId, beneficiary',
  releases: 'vestingId',
});

export { db };
