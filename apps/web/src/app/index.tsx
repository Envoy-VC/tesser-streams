import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@tesser-streams/ui/components/button';

const HomeComponent = () => {
  return (
    <div className='p-3'>
      <Button>Welcome Home!</Button>
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: HomeComponent,
});
