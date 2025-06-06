import { VestingDetails } from '@/components';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/manage/$vestingId')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='mx-auto mt-24 flex w-full max-w-screen-xl flex-col gap-4 px-8'>
      <VestingDetails />
    </div>
  );
}
