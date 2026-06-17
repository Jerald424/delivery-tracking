import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import Container from 'src/components/styled/atoms/container';
import HMAModalLoader from 'src/components/styled/molecules/loader/modalLoader';
import HMAForm from 'src/components/styled/organism/form';
import usePreTripDetails from './usePreTripDetails';
import HMAButton from 'src/components/styled/atoms/button';
import { ScrollView } from 'react-native';

export default function PreTripDetails({
  onStart,
  isLoadingTripStart,
}: {
  onStart: (data: any) => void;
  isLoadingTripStart?: boolean;
}) {
  const navigation = useNavigation();
  const { drivers, isLoading, control, formData, handleSubmit } =
    usePreTripDetails();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Enter Trip Details',
      headerShown: true,
    });
    return () =>
      navigation.setOptions({
        headerShown: false,
      });
  }, []);
  return (
    <Container backgroundColor="background">
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <HMAForm data={formData} control={control} />
      </ScrollView>
      <HMAModalLoader isVisible={isLoading || isLoadingTripStart} />
      <HMAButton
        onPress={handleSubmit(data => onStart?.(data))}
        title="Start Trip"
      />
    </Container>
  );
}
