// biome-ignore lint/style/noNamespaceImport: <explanation>
import * as sheetPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import type * as react from 'react';

import { cn } from '@tesser-streams/ui/lib/utils';

function Sheet({ ...props }: react.ComponentProps<typeof sheetPrimitive.Root>) {
  return (
    <sheetPrimitive.Root
      data-slot='sheet'
      {...props}
    />
  );
}

function SheetTrigger({
  ...props
}: react.ComponentProps<typeof sheetPrimitive.Trigger>) {
  return (
    <sheetPrimitive.Trigger
      data-slot='sheet-trigger'
      {...props}
    />
  );
}

function SheetClose({
  ...props
}: react.ComponentProps<typeof sheetPrimitive.Close>) {
  return (
    <sheetPrimitive.Close
      data-slot='sheet-close'
      {...props}
    />
  );
}

function SheetPortal({
  ...props
}: react.ComponentProps<typeof sheetPrimitive.Portal>) {
  return (
    <sheetPrimitive.Portal
      data-slot='sheet-portal'
      {...props}
    />
  );
}

function SheetOverlay({
  className,
  ...props
}: react.ComponentProps<typeof sheetPrimitive.Overlay>) {
  return (
    <sheetPrimitive.Overlay
      data-slot='sheet-overlay'
      className={cn(
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in',
        className
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  side = 'right',
  ...props
}: react.ComponentProps<typeof sheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <sheetPrimitive.Content
        data-slot='sheet-content'
        className={cn(
          'fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:duration-300 data-[state=open]:duration-500',
          side === 'right' &&
            'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
          side === 'left' &&
            'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
          side === 'top' &&
            'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
          side === 'bottom' &&
            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
          className
        )}
        {...props}
      >
        {children}
        <sheetPrimitive.Close className='absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary'>
          <XIcon className='size-4' />
          <span className='sr-only'>Close</span>
        </sheetPrimitive.Close>
      </sheetPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: react.ComponentProps<'div'>) {
  return (
    <div
      data-slot='sheet-header'
      className={cn('flex flex-col gap-1.5 p-4', className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: react.ComponentProps<'div'>) {
  return (
    <div
      data-slot='sheet-footer'
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: react.ComponentProps<typeof sheetPrimitive.Title>) {
  return (
    <sheetPrimitive.Title
      data-slot='sheet-title'
      className={cn('font-semibold text-foreground', className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: react.ComponentProps<typeof sheetPrimitive.Description>) {
  return (
    <sheetPrimitive.Description
      data-slot='sheet-description'
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
