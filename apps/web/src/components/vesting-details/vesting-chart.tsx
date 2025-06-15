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

import type { VestingSchedule } from '@/lib/zod';
import dayjs from 'dayjs';

export const description = 'A simple area chart';

const chartConfig = {
  releasableAmount: {
    label: 'Releasable Amount',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

interface VestingChartProps {
  schedule: VestingSchedule | undefined;
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
              // format to DD/MM/YY using dayjs
              tickFormatter={(value) => {
                return dayjs(value * 1000).format('DD/MM/YY');
              }}
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
