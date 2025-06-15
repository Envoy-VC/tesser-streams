import { formatEther } from 'viem';
import type { VestingSchedule } from './zod';

export const getDuration = (
  duration: number,
  unit: 'days' | 'weeks' | 'months' | 'years'
) => {
  switch (unit) {
    case 'days':
      return duration * 24 * 3600;
    case 'weeks':
      return duration * 7 * 24 * 3600;
    case 'months':
      return duration * 30 * 24 * 3600;
    case 'years':
      return duration * 365 * 24 * 3600;
    default:
      return duration;
  }
};

export const formatSeconds = (seconds: number) => {
  const units = [
    { label: 'year', seconds: 365 * 24 * 60 * 60 },
    { label: 'month', seconds: 30 * 24 * 60 * 60 },
    { label: 'day', seconds: 24 * 60 * 60 },
    { label: 'hour', seconds: 60 * 60 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const unit of units) {
    const amount = Math.floor(seconds / unit.seconds);
    if (amount > 0) {
      return `${amount} ${unit.label}${amount > 1 ? 's' : ''}`;
    }
  }

  return '0 seconds';
};

export function timeBetween(
  from: number,
  to: number,
  largestOnly = false
): string {
  // biome-ignore lint/style/noParameterAssign: false positive
  from = Math.floor(from);
  // biome-ignore lint/style/noParameterAssign: false positive
  if (to > 1e12) to = Math.floor(to);

  let seconds = Math.abs(to - from);

  const units = [
    { label: 'year', seconds: 365 * 24 * 60 * 60 },
    { label: 'month', seconds: 30 * 24 * 60 * 60 },
    { label: 'day', seconds: 24 * 60 * 60 },
    { label: 'hour', seconds: 60 * 60 },
    { label: 'minute', seconds: 60 },
  ];

  const parts: string[] = [];

  for (const unit of units) {
    const amount = Math.floor(seconds / unit.seconds);
    if (amount > 0) {
      parts.push(`${amount} ${unit.label}${amount > 1 ? 's' : ''}`);
      seconds %= unit.seconds;
      if (largestOnly) break;
    }
  }

  return parts.length > 0 ? parts.slice(0, 3).join(', ') : '0 seconds';
}

export function formatCurrency(
  val: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  let formattedNumber: string;
  let suffix = '';
  let value = val;

  if (value >= 1_000_000_000) {
    value /= 1_000_000_000;
    suffix = 'B';
  } else if (value >= 1_000_000) {
    value /= 1_000_000;
    suffix = 'M';
  } else if (value >= 1_000) {
    value /= 1_000;
    suffix = 'K';
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  });

  formattedNumber = formatter.format(value);

  // Remove currency symbol from abbreviated values, to avoid things like "$1.2M"
  // Optional: comment out this block if you want the currency symbol retained.
  if (suffix) {
    const parts = formatter.formatToParts(value);
    const numberPart = parts.find(
      (p) =>
        p.type === 'integer' || p.type === 'decimal' || p.type === 'fraction'
    );
    const decimalPart = parts.map((p) => p.value).join('');
    formattedNumber = decimalPart;
  }

  return `${formattedNumber}${suffix}`;
}

export const getScheduleDetails = (schedule: VestingSchedule | undefined) => {
  if (!schedule) {
    return {
      cliffDuration: {
        value: 0,
        formatted: '0 seconds',
      },
      vestingDuration: {
        value: 0,
        formatted: '0 seconds',
      },
      totalAmount: {
        value: 0n,
        formatted: '0',
      },
      vestingEndsIn: '0 seconds',
      releasable: 0n,
    };
  }

  const { startTime, cliffDuration, vestingDuration } = schedule;

  const current = Math.floor(Date.now() / 1000);

  return {
    cliffDuration: {
      value: cliffDuration,
      formatted: formatSeconds(cliffDuration),
    },
    vestingDuration: {
      value: vestingDuration,
      formatted: formatSeconds(vestingDuration),
    },
    totalAmount: {
      value: schedule.totalAmount,
      formatted: formatEther(schedule.totalAmount),
    },
    vestingEndsIn: timeBetween(
      startTime + vestingDuration + cliffDuration,
      current
    ),
  };
};

export const computeVested = (schedule: VestingSchedule) => {
  if (schedule.frozen) return Number(schedule.released);
  const timestamp = Math.floor(Date.now() / 1000);
  if (timestamp < schedule.startTime + schedule.cliffDuration) return 0;

  const vestingEnd =
    schedule.startTime + schedule.cliffDuration + schedule.vestingDuration;

  if (timestamp >= vestingEnd) return Number(schedule.totalAmount);

  const elapsed = timestamp - (schedule.startTime + schedule.cliffDuration);
  const ratio = elapsed / schedule.vestingDuration;
  const ratioAlpha = ratio ** (Number(schedule.alpha) / 1e18);

  return Number(schedule.totalAmount) * ratioAlpha;
};

export const computeReleasable = (schedule: VestingSchedule | undefined) => {
  if (!schedule) return 0;
  if (schedule.frozen) return 0;
  const vested = computeVested(schedule);
  const releasable =
    vested > schedule.released ? vested - Number(schedule.released) : 0n;
  return Number(formatEther(BigInt(releasable)));
};

const getExpectedReleasableAtTime = (
  current: number,
  totalAmount: bigint,
  alpha: bigint,
  startAt: number,
  cliffDuration: number,
  vestingDuration: number
) => {
  const elapsed = current - (startAt + cliffDuration);
  if (elapsed < 0) return 0;
  const ratio = elapsed / vestingDuration;
  const ratioAlpha = ratio ** (Number(alpha) / 1e18);
  return (Number(totalAmount) * ratioAlpha) / 1e18;
};

export const computeChartData = (schedule: VestingSchedule | undefined) => {
  if (!schedule) return [];
  const chartData = [];
  const cliffEnd = schedule.startTime + schedule.cliffDuration;
  chartData.push({
    timestamp: schedule.startTime,
    releasableAmount: getExpectedReleasableAtTime(
      schedule.startTime,
      schedule.totalAmount,
      schedule.alpha,
      schedule.startTime,
      schedule.cliffDuration,
      schedule.vestingDuration
    ),
  });
  chartData.push({
    timestamp: cliffEnd,
    releasableAmount: getExpectedReleasableAtTime(
      cliffEnd,
      schedule.totalAmount,
      schedule.alpha,
      schedule.startTime,
      schedule.cliffDuration,
      schedule.vestingDuration
    ),
  });
  const daysAfterCliff = Math.floor(schedule.vestingDuration / (24 * 3600));
  for (let i = 0; i < daysAfterCliff; i++) {
    const timestamp = cliffEnd + i * 24 * 3600;
    chartData.push({
      timestamp,
      releasableAmount: getExpectedReleasableAtTime(
        timestamp,
        schedule.totalAmount,
        schedule.alpha,
        schedule.startTime,
        schedule.cliffDuration,
        schedule.vestingDuration
      ),
    });
  }
  return chartData;
};
