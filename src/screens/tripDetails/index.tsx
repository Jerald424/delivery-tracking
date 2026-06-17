import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, ScrollView, View } from 'react-native';
import TripInProgress from 'src/components/layout/tripInPrograss';
import HMAButton from 'src/components/styled/atoms/button';
import HMACard from 'src/components/styled/atoms/card';
import Container from 'src/components/styled/atoms/container';
import HMADivider from 'src/components/styled/atoms/divider';
import HMAText from 'src/components/styled/atoms/text';
import HMAModalLoader from 'src/components/styled/molecules/loader/modalLoader';
import HMAForm, { formDataProps } from 'src/components/styled/organism/form';
import { checkLocationEnabled } from 'src/function/locationPermission';
import { useTheme } from 'src/hooks/useTheme';
import { endTripApi } from './api';
import useActiveTrip from '../tracker/hooks/useActiveTrip';
import { HAIRLINE_WIDTH } from 'src/utils/variables';

export default function TripDetails({ navigation, route }) {
  const params = route?.params;
  const { data, tripStartTime } = useActiveTrip();
  const { control, handleSubmit } = useForm();
  const { spacing, metrics, colors } = useTheme();
  const [isSelected, setIsSelected] = useState('toll');
  const { refetch } = useActiveTrip();
  const { mutate, isPending } = useMutation({
    mutationKey: ['end/trip'],
    mutationFn: endTripApi,
  });

  const { mutate: fetchLatLon, isPending: isLoadingFetchLatLon } = useMutation({
    mutationKey: ['fetch/lat-long'],
    mutationFn: checkLocationEnabled,
  });

  const types = [
    { id: 'toll', icon: '🛣️', label: 'Toll' },
    { id: 'parking', icon: '🅿️', label: 'Parking' },
    { id: 'fuel', icon: '⛽', label: 'Fuel' },
    { id: 'food', icon: '🍽️', label: 'Food' },
    { id: 'other', icon: '•••', label: 'Other' },
  ];

  const formData: formDataProps = [
    {
      inputType: 'input-box',
      name: `${isSelected}.amount`,
      textInputProps: {
        placeholder: 'Enter amount',
        style: { backgroundColor: colors?.background },
        keyboardType: 'number-pad',
      },
    },
    {
      inputType: 'input-box',
      name: `${isSelected}.description`,
      textInputProps: {
        placeholder: 'Enter description',
        style: {
          backgroundColor: colors?.background,
          height: 100,
          textAlignVertical: 'top',
        },
        multiline: true,
      },
    },
  ];

  const onSubmit = (data: any) => {
    fetchLatLon(
      {},
      {
        onSuccess(location) {
          const expenses = Object.keys(data).map(type => {
            const values = data[type];
            return {
              type,
              amount: values?.amount,
              description: values?.description,
            };
          });
          const payload = {
            params: {
              expenses,
              ...location?.coords,
            },
            trip_id: params?.trip_id,
          };
          console.log('payload: ', payload);
          mutate(payload, {
            onSuccess(data) {
              refetch().then(() => {
                navigation?.replace('Dashboard');
              });
              console.log('data: ', data);
            },
            onError(error) {
              Alert.alert('ERROR: ', JSON.stringify(error));
            },
          });
        },
      },
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <>
          <HMAText size="small" color="lightBackground">
            {data?.active_trip?.trip_name}
          </HMAText>
          <HMAText color="background" variant="title">
            {data?.active_trip?.trip_from} {` `} → {` `}{' '}
            {data?.active_trip?.trip_to}
          </HMAText>
        </>
      ),
    });
  }, []);
  return (
    <Container backgroundColor="lightBackground">
      <ScrollView style={{ flexGrow: 0 }} horizontal>
        {types?.map(type => (
          <HMACard
            onPress={() => setIsSelected(type?.id)}
            key={type.id}
            style={[
              {
                flex: 1,
                width: 60,
                marginHorizontal: spacing.sm,
                paddingVertical: spacing.sm,
                ...metrics.radius,
                borderRadius: metrics.radius.md,
              },
              isSelected == type.id && { backgroundColor: colors?.primary },
            ]}
          >
            <HMAText align="center">{type.icon}</HMAText>
            <HMAText
              align="center"
              size="small"
              variant="title"
              color={isSelected == type.id ? 'background' : 'textSecondary'}
            >
              {type.label}
            </HMAText>
          </HMACard>
        ))}
      </ScrollView>
      <HMADivider space={'md'} />
      <View style={{ flex: 1 }}>
        <HMAForm data={formData} control={control} />
        <HMACard
          style={{ borderRadius: metrics.radius.md, overflow: 'hidden' }}
        >
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                borderWidth: HAIRLINE_WIDTH,
                borderColor: colors.border,
                padding: spacing.md,
                flex: 1,
              }}
            >
              <HMAText size="small" color="textSecondary">
                📍 Total Distance
              </HMAText>
              <HMAText variant="title">
                {Number(data?.active_trip?.total_km).toFixed(2)}
              </HMAText>
            </View>
            <View
              style={{
                borderWidth: HAIRLINE_WIDTH,
                borderColor: colors.border,
                padding: spacing.md,
                flex: 1,
              }}
            >
              <HMAText size="small" color="textSecondary">
                📅 Start Time
              </HMAText>
              <HMAText variant="title">
                {tripStartTime?.date !== 'Today' && tripStartTime?.date}
                {` `} {tripStartTime?.time}
              </HMAText>
            </View>
          </View>
        </HMACard>
      </View>
      <HMAButton title="Submit" onPress={handleSubmit(onSubmit)} />
      <TripInProgress isTripStarted={true} />
      <HMAModalLoader isVisible={isPending || isLoadingFetchLatLon} />
    </Container>
  );
}

/* <HMAText size="small" variant="title">
            Trip Start Date: {` `} {tripStartTime?.date}
            {` `} {tripStartTime?.time}
          </HMAText>*/
