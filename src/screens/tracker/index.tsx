import { useEffect } from 'react';
import { View } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import HMAButton from 'src/components/styled/atoms/button';
import Container from 'src/components/styled/atoms/container';
import HMAText from 'src/components/styled/atoms/text';
import HMAModalTemplate from 'src/components/styled/template/modal';
import { checkLocationEnabled } from 'src/function/locationPermission';
import withLocation from 'src/hoc/withLocation';
import { useTheme } from 'src/hooks/useTheme';
import useTracker from './useTracker';
import HMADivider from 'src/components/styled/atoms/divider';
import Toast from 'src/components/styled/atoms/toast';
import useBackHandle from 'src/hooks/useBackHandle';
import TripInProgress from 'src/components/layout/tripInPrograss';

function Tracker() {
  const { spacing, colors, metrics } = useTheme();
  const {
    isOpen,
    isStart,
    mapRef,
    onEnd,
    onStart,
    routeCoords,
    setIsOpen,
    toastRef,
  } = useTracker();

  useEffect(() => {
    checkLocationEnabled().then(location => {
      mapRef?.current?.animateToRegion?.(
        {
          ...location?.coords,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      );
    });
  }, []);

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
          showsUserLocation
          followsUserLocation
          ref={mapRef}
          style={[{ flex: 1 }]}
        >
          <Polyline
            coordinates={routeCoords}
            strokeColor="#E85D24"
            strokeWidth={4}
          />
        </MapView>
        <View style={{ padding: spacing.md }}>
          <HMAText variant="title">Trip Start Time: 9:50AM</HMAText>
          <HMADivider />
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
      <Toast ref={toastRef} showMs={10000} />
      <TripInProgress isTripStarted={isStart} />
    </Container>
  );
}

export default withLocation(Tracker);
