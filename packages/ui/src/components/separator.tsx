'use client';

// biome-ignore lint/style/noNamespaceImport: <explanation>
import * as separatorPrimitive from '@radix-ui/react-separator';
import type * as react from 'react';

import { cn } from '@tesser-streams/ui/lib/utils';

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: react.ComponentProps<typeof separatorPrimitive.Root>) {
  return (
    <separatorPrimitive.Root
      data-slot='separator'
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px',
        className
      )}
      {...props}
    />
  );
}

export { Separator };
