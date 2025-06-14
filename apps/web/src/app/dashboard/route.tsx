import { ConnectWallet, Sidebar } from '@/components';
import { Outlet, createFileRoute, useLocation } from '@tanstack/react-router';
import { SidebarProvider } from '@tesser-streams/ui/components/sidebar';
import { AnimatePresence, motion } from 'motion/react';

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();
  return (
    <SidebarProvider>
      <ConnectWallet />
      <div className='px-4'>
        <Sidebar />
      </div>
      <div className='h-full w-full'>
        <AnimatePresence mode='popLayout'>
          <motion.div
            key={pathname}
            initial={{ opacity: 0.5, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </SidebarProvider>
  );
}
