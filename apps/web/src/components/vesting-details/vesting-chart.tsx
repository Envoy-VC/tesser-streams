'use client';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { computeChartData } from '@/lib/helpers';
import { Card, CardContent } from '@tesser-streams/ui/components/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@tesser-streams/ui/components/chart';
import { useMemo } from 'react';

export const description = 'A simple area chart';

const chartConfig = {
  releasableAmount: {
    label: 'Releasable Amount',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

interface VestingChartProps {
  schedule:
    | {
        beneficiary: `0x${string}`;
        token: `0x${string}`;
        startTime: number;
        cliffDuration: number;
        vestingDuration: number;
        alpha: bigint;
        totalAmount: bigint;
        released: bigint;
        frozen: boolean;
      }
    | undefined;
}

export const VestingChart = ({ schedule }: VestingChartProps) => {
  const chartData = useMemo(() => {
    return computeChartData(schedule);
  }, [schedule]);
  return (
    <Card>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className='h-[16rem] w-full'
        >
          <AreaChart
            accessibilityLayer={true}
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
            className=''
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='timestamp'
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='releasableAmount'
              layout='horizontal'
              type='natural'
              fill='var(--primary)'
              fillOpacity={0.4}
              stroke='var(--primary)'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
