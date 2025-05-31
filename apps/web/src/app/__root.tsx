import { ProviderTree } from '@/providers';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import '@zkpersona/ui/globals.css';

const RootComponent = () => {
  return (
    <ProviderTree>
      <Outlet />
      {import.meta.env.MODE === 'development' && (
        <TanStackRouterDevtools position='bottom-right' />
      )}
    </ProviderTree>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
