import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, ScrollView, View } from 'react-native';
import TripInProgress from 'src/components/layout/tripInPrograss';
import HMAButton from 'src/components/styled/atoms/button';
import HMACard from 'src/components/styled/atoms/card';
import Container from 'src/components/styled/atoms/container';
import HMADivider from 'src/components/styled/atoms/divider';
import HMAText from 'src/components/styled/atoms/text';
import HMAForm, { formDataProps } from 'src/components/styled/organism/form';
import { useTheme } from 'src/hooks/useTheme';
import { endTripApi } from './api';
import HMAModalLoader from 'src/components/styled/molecules/loader/modalLoader';
import { checkLocationEnabled } from 'src/function/locationPermission';
import useActiveTrip from '../tracker/hooks/useActiveTrip';

export default function TripDetails({ navigation }) {
  const { control, handleSubmit } = useForm();
  const { spacing, metrics, colors } = useTheme();
  const [isSelected, setIsSelected] = useState('toll');
  const activeTrip = useActiveTrip();
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
            trip_id: activeTrip?.trip_id,
          };
          console.log('payload: ', payload);
          mutate(payload, {
            onSuccess(data) {
              console.log('data: ', data);
              navigation?.replace('Dashboard');
            },
            onError(error) {
              Alert.alert('ERROR: ', JSON.stringify(error));
            },
          });
        },
      },
    );
  };
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
      <HMAForm data={formData} control={control} style={{ flex: 1 }} />
      <HMAButton title="Submit" onPress={handleSubmit(onSubmit)} />
      <TripInProgress isTripStarted={true} />
      <HMAModalLoader isVisible={isPending || isLoadingFetchLatLon} />
    </Container>
  );
}
