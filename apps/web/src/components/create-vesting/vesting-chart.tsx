'use client';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent } from '@tesser-streams/ui/components/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@tesser-streams/ui/components/chart';
import { useMemo } from 'react';

const chartConfig = {
  vestedValue: {
    label: 'Vested Value',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

interface VestingChartProps {
  alpha: number;
}

const maxValue = 1_000_000;

const SECONDS_IN_A_DAY = 24 * 3600;
const DAYS_IN_A_YEAR = 365;
const totalDuration = DAYS_IN_A_YEAR * 24 * 3600;

export const VestingChart = ({ alpha }: VestingChartProps) => {
  const chartData = useMemo(() => {
    return Array.from({ length: 365 }, (_, i) => i).map((d) => {
      return {
        dayIndex: d.toString(),
        vestedValue: Math.floor(
          maxValue * ((d * SECONDS_IN_A_DAY) / totalDuration) ** alpha
        ),
      };
    });
  }, [alpha]);
  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer={true}
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='dayIndex'
              tickLine={false}
              axisLine={false}
              ticks={[
                1, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360,
              ]}
              interval='preserveStartEnd'
              tickCount={1}
              minTickGap={3}
              tickMargin={0}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator='dot'
                  labelClassName='flex gap-2'
                />
              }
            />
            <Area
              dataKey='vestedValue'
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
