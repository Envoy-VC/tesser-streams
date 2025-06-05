import { MintTesser } from '@/components';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/mint')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <MintTesser />
    </div>
  );
}
