'use client';

// biome-ignore lint/style/noNamespaceImport: <explanation>
import * as labelPrimitive from '@radix-ui/react-label';
import type * as react from 'react';

import { cn } from '@tesser-streams/ui/lib/utils';

function Label({
  className,
  ...props
}: react.ComponentProps<typeof labelPrimitive.Root>) {
  return (
    <labelPrimitive.Root
      data-slot='label'
      className={cn(
        'flex select-none items-center gap-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { Label };
