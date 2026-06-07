import useBackHandle from 'src/hooks/useBackHandle';
import HMAAlert, { alertRefProp } from '../styled/template/modal/alert';
import { useRef } from 'react';

export default function TripInProgress({
  isTripStarted,
}: {
  isTripStarted?: boolean;
}) {
  const alertRef = useRef<alertRefProp>(null);
  useBackHandle(isTripStarted || false, () =>
    alertRef?.current?.showAlert?.({
      title: 'Trip Inprogress',
      message: 'Please end trip before close',
    }),
  );
  return <HMAAlert ref={alertRef} />;
}
