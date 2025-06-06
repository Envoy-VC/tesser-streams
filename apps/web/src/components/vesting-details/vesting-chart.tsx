'use client';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent } from '@tesser-streams/ui/components/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@tesser-streams/ui/components/chart';

export const description = 'A simple area chart';

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
  { month: 'July', desktop: 210 },
  { month: 'August', desktop: 210 },
  { month: 'September', desktop: 210 },
  { month: 'October', desktop: 210 },
  { month: 'November', desktop: 210 },
  { month: 'December', desktop: 210 },
];

export const VestingChart = () => {
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
              dataKey='month'
              tickLine={false}
              axisLine={false}
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
              dataKey='desktop'
              layout='horizontal'
              type='natural'
              fill='var(--color-desktop)'
              fillOpacity={0.4}
              stroke='var(--color-desktop)'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
