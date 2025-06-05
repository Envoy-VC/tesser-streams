import { Sidebar } from '@/components';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { SidebarProvider } from '@tesser-streams/ui/components/sidebar';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <div className='px-4'>
        <Sidebar />
      </div>
      <div>
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
