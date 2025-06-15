import Spline from '@splinetool/react-spline';
import { Link } from '@tanstack/react-router';
import { Button } from '@tesser-streams/ui/components/button';
import { ArrowRight } from 'lucide-react';

export const Hero = () => {
  return (
    <div className='hide-scrollbar relative h-full max-h-screen w-full overflow-hidden'>
      <div className='absolute top-6 right-6 z-[100]'>
        <Button className='group h-7 w-[8rem] font-medium'>
          <Link
            to='/dashboard'
            className='flex w-full items-center gap-2'
          >
            Dashboard
            <ArrowRight className='-ml-1 h-4 w-4 transition-all duration-300 ease-in-out group-hover:translate-x-1' />
          </Link>
        </Button>
      </div>
      <div className='h-screen scale-[120%]'>
        <Spline scene='https://prod.spline.design/UO0jQq4RZkEmTGnw/scene.splinecode' />
      </div>
    </div>
  );
};
