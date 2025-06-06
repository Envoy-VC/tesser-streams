import { db } from '@/db';
import { Link } from '@tanstack/react-router';

import { useLiveQuery } from 'dexie-react-hooks';

export const ManageSchedules = () => {
  const schedules = useLiveQuery(async () => {
    return await db.schedules.toArray();
  });
  return (
    <div>
      {schedules?.map((schedule) => (
        <Link
          to='/dashboard/manage/$vestingId'
          params={{ vestingId: schedule.vestingId }}
          key={schedule.vestingId}
        >
          {schedule.vestingId}
        </Link>
      ))}
    </div>
  );
};
