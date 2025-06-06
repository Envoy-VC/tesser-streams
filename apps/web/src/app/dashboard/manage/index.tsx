import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/manage/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard/manage/"!</div>;
}
