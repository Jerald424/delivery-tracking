import { useMemo } from 'react';
import {
  formateDate,
  jsDateToDDMMYYYY,
  jsDateToYYYYMMDD,
} from 'src/function/dateConversion';
import { useActiveTripState, useAppDispatch } from 'src/redux/hooks';
import { fetchLastActiveTrip } from 'src/redux/slices/activeTrip/thunk';

export default function useActiveTrip() {
  const { data } = useActiveTripState();

  const dispatch = useAppDispatch();

  const tripStartTime = useMemo(() => {
    try {
      const date = jsDateToYYYYMMDD(new Date());
      const dt = formateDate(data?.result?.active_trip?.start_time);
      console.log('#####', data?.result?.active_trip?.start_time);
      if (dt && dt?.date == date) dt['date'] = 'Today';
      if (data?.result?.has_active_trip) return dt;
    } catch (error) {
      console.error(error);
    }
  }, [data]);

  return {
    data: data?.result,
    refetch: () => dispatch(fetchLastActiveTrip()),
    tripStartTime,
  };
}
