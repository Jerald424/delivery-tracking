import Container from 'src/components/styled/atoms/container';
import withLocation from 'src/hoc/withLocation';
import MapView, { Marker } from 'react-native-maps';
import { useRef } from 'react';
import { View } from 'react-native';
import HMACard from 'src/components/styled/atoms/card';
import { useTheme } from 'src/hooks/useTheme';
import HMAText from 'src/components/styled/atoms/text';
import HMAButton from 'src/components/styled/atoms/button';

function Tracker({ position }) {
  const mapRef = useRef(null);
  const { spacing, colors, metrics } = useTheme();

  return (
    <Container padding={0} backgroundColor="error">
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
            latitude: 100,
            longitude: 100,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        />
        <View style={{ padding: spacing.md }}>
          <HMAButton title="Start Trip" />
        </View>
      </View>
    </Container>
  );
}

// export default withLocation(Tracker);
export default Tracker;
