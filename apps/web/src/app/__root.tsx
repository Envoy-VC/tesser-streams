import { ProviderTree } from '@/providers';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Toaster } from '@tesser-streams/ui/components/sonner';

import '@tesser-streams/ui/globals.css';

const RootComponent = () => {
  return (
    <ProviderTree>
      <Toaster richColors={true} />
      <div className='h-full w-full'>
        <Outlet />
      </div>
    </ProviderTree>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
