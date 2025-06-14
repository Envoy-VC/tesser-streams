import { Link } from '@tanstack/react-router';
import { Button } from '@tesser-streams/ui/components/button';
import {
  SidebarContent,
  Sidebar as SidebarCore,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@tesser-streams/ui/components/sidebar';
import { cn } from '@tesser-streams/ui/lib/utils';
import {
  CalendarCogIcon,
  CalendarPlus2Icon,
  CirclePlusIcon,
  LayoutDashboardIcon,
  PanelLeftIcon,
  SettingsIcon,
  StoreIcon,
} from 'lucide-react';
import { TesserStreamsLogo } from '../logo';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Create Schedule',
    href: '/dashboard/create',
    icon: CalendarPlus2Icon,
  },
  {
    title: 'Manage Schedules',
    href: '/dashboard/manage',
    icon: CalendarCogIcon,
  },
  {
    title: 'Marketplace',
    href: '/dashboard/marketplace',
    icon: StoreIcon,
  },
];

const nav2Items = [
  {
    title: 'Mint Tesser',
    href: '/dashboard/mint',
    icon: CirclePlusIcon,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: SettingsIcon,
  },
];

export const Sidebar = () => {
  const { open, setOpen, isMobile, setOpenMobile } = useSidebar();
  return (
    <SidebarCore
      variant='floating'
      collapsible='icon'
      className=' mx-6 my-auto h-[calc(100%-48px)] overflow-clip rounded-2xl px-0 py-0'
    >
      <SidebarHeader className='border-b'>
        <SidebarMenu>
          <SidebarMenuItem
            className={cn(
              'flex items-center gap-2',
              open ? 'justify-between' : 'justify-center'
            )}
          >
            <div className='group/header-icon flex flex-row items-center gap-2'>
              <SidebarMenuButton
                size='lg'
                className='flex items-center justify-center transition-all duration-300 ease-in-out group-hover/header-icon:rotate-6 group-hover/header-icon:scale-[107%] group-data-[collapsible=icon]:size-12! [&>svg]:size-7'
              >
                <TesserStreamsLogo
                  fill='#fff'
                  stroke='#fff'
                />
              </SidebarMenuButton>
              <div
                className={cn(
                  'group-hover/header-icon:-translate-x-1 text-3xl transition-all duration-300 ease-in-out',
                  open ? 'block' : 'hidden'
                )}
              >
                Tesser
              </div>
            </div>
            {open && (
              <Button
                variant='outline'
                size='icon'
                className='justify-self-end'
                onClick={() => {
                  if (isMobile) {
                    setOpenMobile(false);
                  } else {
                    setOpen(false);
                  }
                }}
              >
                <PanelLeftIcon />
              </Button>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {!open && (
          <SidebarGroup className='border-b py-4'>
            <SidebarMenu className='flex items-center justify-center'>
              <SidebarMenuItem>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => {
                    if (isMobile) {
                      setOpenMobile(true);
                    } else {
                      setOpen(true);
                    }
                  }}
                >
                  <PanelLeftIcon />
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
        <SidebarGroup className='border-b py-4'>
          <SidebarMenu className={cn('flex flex-col items-center gap-2')}>
            {navItems.map((item) => (
              <SidebarMenuItem
                key={item.title}
                className={cn(
                  'my-[2px] flex h-10 flex-row items-center gap-2 rounded-xl transition-colors duration-300 ease-in-out hover:border-[#644AEE]/15 hover:bg-[#644AEE]/15 hover:text-[#644AEE]',
                  open ? 'w-full' : 'w-12 justify-center text-neutral-400'
                )}
              >
                <Link
                  to={item.href}
                  className='flex h-10 w-full items-center justify-center'
                  activeProps={{
                    className:
                      '!text-[#644AEE] !border-[#644AEE]/15 !bg-[#644AEE]/15 rounded-xl',
                  }}
                  activeOptions={{
                    exact: true,
                  }}
                >
                  <SidebarMenuButton
                    className={cn(
                      '!h-10 flex w-full flex-row items-center gap-4 hover:text-[#644AEE]'
                    )}
                    variant='default'
                  >
                    <item.icon />
                    <div className='font-medium text-[1rem]'>{item.title}</div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className='border-b py-4'>
          <SidebarMenu className={cn('flex flex-col items-center gap-2')}>
            {nav2Items.map((item) => (
              <SidebarMenuItem
                key={item.title}
                className={cn(
                  'my-[2px] flex h-10 flex-row items-center gap-2 rounded-xl transition-colors duration-300 ease-in-out hover:border-[#644AEE]/15 hover:bg-[#644AEE]/15 hover:text-[#644AEE]',
                  open ? 'w-full' : 'w-12 justify-center text-neutral-400'
                )}
              >
                <Link
                  to={item.href}
                  className='flex h-10 w-full items-center justify-center'
                  activeProps={{
                    className:
                      '!text-[#644AEE] !border-[#644AEE]/15 !bg-[#644AEE]/15 rounded-xl',
                  }}
                  activeOptions={{
                    exact: true,
                  }}
                >
                  <SidebarMenuButton
                    className={cn(
                      '!h-10 flex w-full flex-row items-center gap-4 hover:text-[#644AEE]'
                    )}
                    variant='default'
                  >
                    <item.icon />
                    <div className='font-medium text-[1rem]'>{item.title}</div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </SidebarCore>
  );
};
