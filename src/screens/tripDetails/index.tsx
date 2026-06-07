import { useForm } from 'react-hook-form';
import TripInProgress from 'src/components/layout/tripInPrograss';
import HMAButton from 'src/components/styled/atoms/button';
import Container from 'src/components/styled/atoms/container';
import HMAForm, { formDataProps } from 'src/components/styled/organism/form';

export default function TripDetails({ navigation }) {
  const { control } = useForm();
  const formData: formDataProps = [
    {
      inputType: 'input-box',
      name: 'fuel',
      textInputProps: {
        placeholder: 'Enter fuel amount',
      },
    },
    {
      inputType: 'input-box',
      name: 'toll',
      textInputProps: {
        placeholder: 'Enter toll amount',
      },
    },
  ];
  return (
    <Container backgroundColor="background">
      <HMAForm data={formData} control={control} style={{ flex: 1 }} />
      <HMAButton title="Submit" onPress={() => {}} />
      <TripInProgress isTripStarted={true} />
    </Container>
  );
}
