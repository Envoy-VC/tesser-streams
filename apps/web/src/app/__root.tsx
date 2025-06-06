import { ProviderTree } from '@/providers';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Toaster } from '@tesser-streams/ui/components/sonner';

import '@tesser-streams/ui/globals.css';

const RootComponent = () => {
  return (
    <ProviderTree>
      <Toaster richColors={true} />
      <div className='h-full w-full'>
        <Outlet />
      </div>
      {import.meta.env.MODE === 'development' && (
        <TanStackRouterDevtools position='bottom-right' />
      )}
    </ProviderTree>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
