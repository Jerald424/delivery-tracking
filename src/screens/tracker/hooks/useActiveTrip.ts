import { useState } from 'react';

export default function useActiveTrip() {
  const [val] = useState({
    trip_id: 1,
    time: '9:50 AM',
    lat_longs: [
      {
        longitude: 80.239625,
        latitude: 12.963,
      },
      {
        longitude: 80.239628,
        latitude: 12.969,
      },
      {
        longitude: 80.23963,
        latitude: 12.972,
      },
      {
        longitude: 80.239,
        latitude: 12.9,
      },
    ],
  });
  return val;
}
