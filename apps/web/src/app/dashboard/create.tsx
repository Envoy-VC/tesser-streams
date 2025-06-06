import { CreateVesting } from '@/components';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/create')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <CreateVesting />
    </div>
  );
}
