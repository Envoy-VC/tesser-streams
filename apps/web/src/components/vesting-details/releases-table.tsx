import { type ReleaseTransaction, db } from '@/db';
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@tesser-streams/ui/components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tesser-streams/ui/components/table';
import dayjs from 'dayjs';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

import advancedFormat from 'dayjs/plugin/advancedFormat';
import { TesserStreamsLogo } from '../logo';

dayjs.extend(advancedFormat);

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export const columns: ColumnDef<ReleaseTransaction>[] = [
  {
    accessorKey: 'transactionHash',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Transaction Hash
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const transactionHash = row.getValue('transactionHash') as string;
      return (
        <div className='text-lg'>{(transactionHash ?? '').slice(0, 10)}...</div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'));
      const formatted = (amount / 1e18).toFixed(3).toLocaleString();
      return (
        <div className='flex flex-row items-center gap-2'>
          <div className='text-lg'>{formatted} </div>
          <div className='flex size-6 items-center justify-center rounded-full bg-primary'>
            <TesserStreamsLogo
              fill='#fff'
              stroke='#fff'
              className='size-4'
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Released At
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const timestamp = Number.parseInt(row.getValue('timestamp'));
      const date = new Date(timestamp * 1000);
      return (
        <div className='text-lg'>{dayjs(date).format('ddd Do MMM YYYY')}</div>
      );
    },
  },
];

export const ReleasesTable = ({ vestingId }: { vestingId: string }) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const data = useLiveQuery(async () => {
    return await db.releases.filter((x) => x.vestingId === vestingId).toArray();
  });

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className='rounded-md border bg-[#08080A]'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className='font-medium text-neutral-400 text-sm'
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className=' !border-none h-14'
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className='border-none'
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className='h-24 text-center'
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
