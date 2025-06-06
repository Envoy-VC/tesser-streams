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

export interface Release {
  vestingId: string;
  amount: number;
  timestamp: number;
}

const db = new Dexie('TesserDB') as Dexie & {
  schedules: EntityTable<VestingSchedule, 'vestingId'>;
  releases: EntityTable<Release, 'vestingId'>;
};

db.version(1).stores({
  schedules: 'vestingId, beneficiary',
  releases: 'vestingId',
});

export { db };
