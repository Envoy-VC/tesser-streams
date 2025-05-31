import Spline from '@splinetool/react-spline';

export const Hero = () => {
  return (
    <div className='hide-scrollbar h-full max-h-screen w-full overflow-hidden'>
      <div className='h-screen scale-[120%]'>
        <Spline scene='https://prod.spline.design/UO0jQq4RZkEmTGnw/scene.splinecode' />
      </div>
    </div>
  );
};
