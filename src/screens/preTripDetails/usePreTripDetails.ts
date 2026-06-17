import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { formDataProps } from 'src/components/styled/organism/form';
import { useAuth } from 'src/redux/hooks';
import axiosInstance from 'src/services/axiosInstance';

const fetchDrivers = async ({ token }: { token: string }) => {
  return await axiosInstance.post('/api/drivers', {
    params: {
      token,
    },
  });
};

export default function usePreTripDetails() {
  const { token } = useAuth();
  const { control, handleSubmit } = useForm();
  const { data, isLoading, error } = useQuery({
    queryKey: ['fetch/drivers', token],
    queryFn: () => fetchDrivers({ token }),
  });

  const formData: formDataProps = [
    {
      inputType: 'drop-down',
      name: 'driver_id',
      dropdownProps: {
        placeholder: 'Select driver',
        searchTextInputProps: {
          autoCapitalize: 'none',
          placeholder: 'Select driver',
        },
        options: data?.result?.drivers,
        optionalLabel: 'name',
        optionalValue: 'id',
      },
      rules: {
        required: {
          value: true,
          message: 'Driver is required',
        },
      },
    },
    {
      inputType: 'input-box',
      name: 'bill_no',
      textInputProps: {
        placeholder: 'Enter bill ',
        autoCapitalize: 'none',
      },
      rules: {
        required: {
          value: true,
          message: 'Bill is required',
        },
      },
    },
    {
      inputType: 'input-box',
      name: 'trip_from',
      textInputProps: {
        placeholder: 'Enter trip from',
      },
      rules: {
        required: {
          value: true,
          message: 'Trip from is required',
        },
      },
    },
    {
      inputType: 'input-box',
      name: 'trip_to',
      textInputProps: {
        placeholder: 'Enter trip to',
      },
      rules: {
        required: {
          value: true,
          message: 'Trip to is required',
        },
      },
    },
    {
      inputType: 'input-box',
      name: 'item_text',
      textInputProps: {
        placeholder: 'Enter item',
      },
      rules: {
        required: {
          value: true,
          message: 'Item is required',
        },
      },
    },
    {
      inputType: 'input-box',
      name: 'total_weight',
      textInputProps: {
        placeholder: 'Enter total weight',
      },
      rules: {
        required: {
          value: true,
          message: 'Total weight is required',
        },
      },
    },
  ];

  return {
    drivers: data?.result?.drivers,
    isLoading,
    formData,
    control,
    handleSubmit,
  };
}
