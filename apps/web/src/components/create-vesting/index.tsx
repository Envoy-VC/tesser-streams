import { CreateVestingForm } from './create-vesting-form';

export const CreateVesting = () => {
  return (
    <div className='card-gradient flex w-full max-w-xl flex-col gap-2 rounded-3xl border p-6'>
      <div className='flex flex-col gap-2'>
        <div className='w-fit font-medium text-2xl text-neutral-100'>
          Create Vesting Schedule
        </div>
        <p className='text-base text-neutral-400'>
          Fractional Vesting is a mechanism in which tokens unlock gradually
          over time, rather than all at once—letting users claim a proportional
          amount as time passes.
        </p>
      </div>
      <div className='pt-5'>
        <CreateVestingForm />
      </div>
    </div>
  );
};
