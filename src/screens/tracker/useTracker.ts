import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { useRef, useState } from 'react';
import { toastRefFn } from 'src/components/styled/atoms/toast';

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

export default function useTracker() {
  const mapRef = useRef(null);
  const [isStart, setIsStart] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [routeCoords, setRouteCoords] = useState([]); // grows as you move
  const watcherId = useRef<any>(null);
  const navigation = useNavigation();
  const toastRef = useRef<toastRefFn>(null);
  console.log('routeCoords: ', routeCoords);

  const onEnd = () => {
    navigation.replace('Trip Details');
    setIsOpen(false);
  };

  const onAddNewCoords = (points: any) => {
    mapRef?.current?.animateToRegion?.(
      {
        ...points,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000,
    );
  };

  const onStart = () => {
    setIsStart(true);
    setIsOpen(false);
    setRouteCoords([]);
    toastRef.current?.showToast?.('Your trip started successfully', 'success');

    watcherId.current = Geolocation.watchPosition(
      ({ coords }) => {
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
          onAddNewCoords(newPoint);
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

  return {
    onEnd,
    onStart,
    mapRef,
    isStart,
    isOpen,
    routeCoords,
    setIsOpen,
    toastRef,
  };
}
