import { Hero } from '@/components';
import { createFileRoute } from '@tanstack/react-router';

const HomeComponent = () => {
  return (
    <div>
      <Hero />
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: HomeComponent,
});
