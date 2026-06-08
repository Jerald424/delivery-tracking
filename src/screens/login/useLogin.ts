import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { formDataProps } from 'src/components/styled/organism/form';
import { alertRefProp } from 'src/components/styled/template/modal/alert';
import { updateAuthSlice } from 'src/redux/slices/auth/slice';
import loginApi from './api/loginApi';
import { useAppDispatch } from 'src/redux/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCOUNTS, BASE_URL, LOGIN_DATA, TOKEN } from 'src/utils/variables';
import axiosInstance from 'src/services/axiosInstance';

export const assignTokenToAxios = (token: string) => {
  // axiosInstance.defaults.headers[TOKEN] = token;
  axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
};

const assignTokenToAsyncStorage = (token: string) => {
  AsyncStorage.setItem(TOKEN, token);
};

export const removeTokenFromAxios = () => {
  axiosInstance.defaults.headers[TOKEN] = null;
};

export const removeTokenFromAsyncStorage = () => {
  AsyncStorage.removeItem(TOKEN);
};

export const assignBaseURlToAxios = (url: string) => {
  axiosInstance.defaults.baseURL = url;
};

export const assignBaseURlToAsyncStorage = (url: string) => {
  AsyncStorage.setItem(BASE_URL, url);
};

export default function useLogin() {
  const dispatch = useAppDispatch();
  const alertRef = useRef<alertRefProp>(null);
  const { control, handleSubmit, reset } = useForm();
  const { mutate, isPending } = useMutation({
    mutationKey: ['login'],
    mutationFn: loginApi,
  });

  const formData: formDataProps = [
    // {
    //   inputType: 'drop-down',
    //   name: 'url',
    //   dropdownProps: {
    //     placeholder: 'Enter url',
    //     searchTextInputProps: {
    //       autoCapitalize: 'none',
    //       placeholder: 'Enter url',
    //     },
    //     options: accounts?.url,
    //   },
    //   rules: {
    //     required: {
    //       value: true,
    //       message: 'Url is required',
    //     },

    //     validate(val) {
    //       console.log('val: ', val);
    //       return /^(https?:\/\/)[^\s"]+$/.test(val?.label)
    //         ? true
    //         : 'Enter valid url';
    //     },
    //   },
    // },
    {
      inputType: 'input-box',
      name: 'username',
      textInputProps: {
        placeholder: 'Enter username',
      },
      rules: {
        required: {
          value: true,
          message: 'Username is required',
        },
      },
    },
    {
      inputType: 'input-box',
      name: 'password',
      textInputProps: {
        placeholder: 'Enter password',
        secureTextEntry: true,
        autoCapitalize: 'none',
      },
      rules: {
        required: {
          value: true,
          message: 'Password is required',
        },
      },
    },
  ];

  const onLogin = (data: any) => {
    // dispatch(updateAuthSlice({ key: 'isLogin', value: true }));

    mutate(data, {
      onError(error) {
        console.log('error: ', error);
        alertRef?.current?.showAlert?.({
          message: error?.Message ?? 'Something went wrong',
        });
      },
      onSuccess(response) {
        console.log('RESPONSE: ', response);
        if (response?.result?.status != 200)
          return alertRef?.current?.showAlert?.({
            message: response?.result?.error ?? 'Something went wrong',
          });
        console.log('#########################', response);

        AsyncStorage.setItem(LOGIN_DATA, JSON.stringify(response));
        assignTokenToAsyncStorage(response?.result?.token);
        assignTokenToAxios(response?.result?.token);
        dispatch(updateAuthSlice({ key: 'isLogin', value: true }));
      },
    });
  };

  return {
    formData,
    control,
    handleSubmit: handleSubmit(onLogin),
    isPending,
    alertRef,
  };
}
