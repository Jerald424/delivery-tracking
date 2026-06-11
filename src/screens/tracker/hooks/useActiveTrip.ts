import { useActiveTripState, useAppDispatch } from 'src/redux/hooks';
import { fetchLastActiveTrip } from 'src/redux/slices/activeTrip/thunk';

export default function useActiveTrip() {
  const { data } = useActiveTripState();

  const dispatch = useAppDispatch();

  console.log('data: ', data);
  return {
    data: data?.result,
    refetch: () => dispatch(fetchLastActiveTrip()),
  };
}
