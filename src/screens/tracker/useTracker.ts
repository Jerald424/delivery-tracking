import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { toastRefFn } from 'src/components/styled/atoms/toast';
import {
  makeJsDateToFormatDate,
  startTripApi,
  updateLocationApi,
} from './apis';
import { checkLocationEnabled } from 'src/function/locationPermission';
import useActiveTrip from './hooks/useActiveTrip';

const getDistance = (coord1, coord2) => {
  const R = 6371000;
  const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((coord1.latitude * Math.PI) / 180) *
      Math.cos((coord2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const MIN_DISTANCE_METRES = 50; // only add point if moved at least 5m
const interval = 60000;
const delay = (ms: number) =>
  new Promise(resolve => setTimeout(() => resolve('OK'), ms));

export default function useTracker() {
  const mapRef = useRef(null);
  const [isStart, setIsStart] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [routeCoords, setRouteCoords] = useState([]); // grows as you move
  const watcherId = useRef<any>(null);
  const navigation = useNavigation();
  const toastRef = useRef<toastRefFn>(null);
  const {
    data: lastTripDetails,
    refetch: refetchLastTrip,
    tripStartTime,
  } = useActiveTrip();
  console.log('lastTripDetails: ', lastTripDetails);

  const { mutate: startTripMutate, isPending: isLoadingTripStart } =
    useMutation({
      mutationKey: ['start/trip'],
      mutationFn: startTripApi,
    });
  const {
    mutate: updateLocationApiMutate,
    isPending: isLoadingUpdateLocation,
  } = useMutation({
    mutationKey: ['update/location'],
    mutationFn: updateLocationApi,
  });

  const { mutate: fetchLatLon, isPending: isLoadingFetchLatLon } = useMutation({
    mutationKey: ['fetch/lat-long'],
    mutationFn: checkLocationEnabled,
  });

  console.log('routeCoords: ', routeCoords);

  const onEnd = () => {
    watcherId.current = null;
    setIsOpen(false);

    navigation.replace('Trip Details', {
      trip_id: lastTripDetails?.active_trip?.trip_id,
    });
  };

  const onAddNewCoords = (points: any) => {
    toastRef.current?.showToast?.('Location updated', 'info');
    console.log('NEW LAT ADDED');
    const payload = {
      ...points,
      tracking_time: makeJsDateToFormatDate(),
      trip_id: lastTripDetails?.active_trip?.trip_id,
    };
    console.log('PAYLOAD: ', payload);
    updateLocationApiMutate(payload, {
      onSuccess(data) {
        console.log('LOCATION UPDATED', data);
      },
      onError(error) {
        console.log('ERROR WHILE UPDATE LOCATION', error);
      },
    });
    mapRef?.current?.animateToRegion?.(
      {
        ...points,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000,
    );
  };

  const onTripStarted = async (arg?: { isResume?: boolean }) => {
    setIsStart(true);
    console.log('ON TRIP STARTED', arg);

    toastRef.current?.showToast?.(
      arg?.isResume
        ? 'Your trip was resumed..'
        : 'Your trip started successfully',
      'success',
    );
    await delay(2000);
    watcherId.current = null;
    watcherId.current = Geolocation.watchPosition(
      location => {
        const { coords } = location;
        console.log('coords: ', coords);
        const newPoint = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };

        setRouteCoords(prev => {
          if (coords.accuracy > 20) return prev; // ignore points with >20m accuracy

          if (prev.length > 0) {
            const dist = getDistance(prev[prev.length - 1], newPoint);
            console.log('dist:', dist);

            if (dist < MIN_DISTANCE_METRES) return prev; // ignore, hasn't moved enough
          }
          onAddNewCoords(coords);
          return [...prev, newPoint];
        });
      },
      err => {
        console.log('LAT, LONG ERROR: ', err);
      },
      {
        enableHighAccuracy: false,
        distanceFilter: MIN_DISTANCE_METRES,
        interval,
        fastestInterval: interval / 2,
        timeout: 6000,
      },
    );
  };

  const updateStartTrip = () => {
    fetchLatLon(
      {},
      {
        onSuccess(location) {
          console.log('FETCH ON TRIP START', location);
          startTripMutate(
            {
              latitude: location?.coords?.latitude,
              longitude: location?.coords?.longitude,
            },
            {
              onSuccess(success) {
                console.log('TRIP STARTED: ', success);

                if (success?.result?.status !== 200) {
                  toastRef.current?.showToast?.(
                    success?.result?.error ?? 'Something went wrong',
                    'error',
                  );

                  return;
                }
                onTripStarted();
              },
              onError(error) {
                console.log('ERROR : TRIP STARTED: ', error);
              },
              onSettled() {
                refetchLastTrip();
              },
            },
          );
        },
      },
    );
  };

  const onStart = () => {
    setIsOpen(false);
    setRouteCoords([]);

    updateStartTrip();
  };

  const resumeTrip = () => {
    setRouteCoords(lastTripDetails?.active_trip?.routes ?? ([] as any));
    onTripStarted({ isResume: true });
  };

  return {
    onEnd,
    onStart,
    mapRef,
    isStart,
    isOpen,
    routeCoords,
    setIsOpen,
    toastRef,
    isLoadingTripStart,
    isLoadingFetchLatLon,
    lastTripDetails,
    resumeTrip,
    refetchLastTrip,
    tripStartTime,
  };
}
