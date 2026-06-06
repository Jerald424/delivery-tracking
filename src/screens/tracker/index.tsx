import Container from 'src/components/styled/atoms/container';
import withLocation from 'src/hoc/withLocation';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import HMACard from 'src/components/styled/atoms/card';
import { useTheme } from 'src/hooks/useTheme';
import HMAText from 'src/components/styled/atoms/text';
import HMAButton from 'src/components/styled/atoms/button';
import HMAModalTemplate from 'src/components/styled/template/modal';
import useLiveLocation from 'src/hooks/useLiveLocation';

function Tracker({ position, navigation }) {
  const mapRef = useRef(null);
  const { spacing, colors, metrics } = useTheme();
  const [isStart, setIsStart] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { location } = useLiveLocation();

  const userLocation = useMemo(
    () => ({
      latitude: location?.latitude || position?.coords?.latitude || 0,
      longitude: location?.longitude || position?.coords?.longitude || 0,
    }),
    [location, position],
  );

  const onEnd = () => {
    navigation.navigate('Trip Details');
    setIsOpen(false);
  };

  const onStart = () => {
    setIsStart(true);
    setIsOpen(false);
  };

  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef?.current?.animateToRegion?.(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      ); // 1000ms animation duration
    }
  }, [userLocation]);

  return (
    <Container padding={0}>
      <View
        style={[
          {
            flex: 1,
            marginHorizontal: spacing.md,
            backgroundColor: colors.background,
            marginTop: spacing.lg,
            borderTopLeftRadius: metrics.radius.lg,
            borderTopRightRadius: metrics.radius.lg,
          },
          metrics.shadow,
        ]}
      >
        <View style={{ padding: spacing.sm }}>
          <HMAText size="title" align="center">
            Tracker
          </HMAText>
        </View>
        <MapView
          ref={mapRef}
          style={[{ flex: 1 }]}
          initialRegion={{
            latitude: userLocation?.latitude,
            longitude: userLocation?.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        />
        <View style={{ padding: spacing.md }}>
          {isStart ? (
            <HMAButton onPress={() => setIsOpen(true)} title="End Trip" />
          ) : (
            <HMAButton onPress={() => setIsOpen(true)} title="Start Trip" />
          )}
        </View>
      </View>
      <HMAModalTemplate
        isVisible={!!isOpen}
        descriptionProps={{
          children: `Are you sure do you want ${
            isStart ? 'end' : 'start'
          } trip`,
        }}
        cancelTextProps={{
          onPress: () => setIsOpen(false),
        }}
        okTextProps={{
          onPress: () => (isStart ? onEnd() : onStart()),
        }}
      />
    </Container>
  );
}

// export default withLocation(Tracker);
export default Tracker;
