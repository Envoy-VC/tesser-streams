import { VestingDetails } from '@/components';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/manage/$vestingId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { vestingId } = Route.useParams();
  return (
    <div className='mx-auto flex w-full max-w-screen-xl flex-col gap-4 px-8'>
      <VestingDetails vestingId={vestingId} />
    </div>
  );
}
