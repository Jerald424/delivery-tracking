import { useEffect, useState } from 'react';
import { getHybridRoute } from './alignCoorids';

export default function useAlignCoords(myLatLngArray: any[]) {
  console.log('myLatLngArray: ', myLatLngArray);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadRoute() {
      try {
        setLoading(true);
        const latlngTuples = myLatLngArray
          .map(p => [p.latitude, p.longitude])
          ?.slice(-10);

        let result = await getHybridRoute(latlngTuples);
        result = result.coords?.map(([latitude, longitude]) => ({
          latitude,
          longitude,
        }));
        console.log('result:+++ ', result);
        if (!cancelled) {
          setCoords(result);
          //   setDistanceKm(result.distanceKm);
        }
      } catch (e) {
        console.log('ERROR', e);
        // if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadRoute();

    return () => {
      cancelled = true; // avoid setting state after unmount
    };
  }, [myLatLngArray]);

  return {
    loading,
    coords,
  };
}
