import axiosInstance from 'src/services/axiosInstance';
import { getDeviceId } from 'src/utils/variables';

export default async function loginApi(payload: any) {
  console.log('payload: ', payload);
  const device_id = getDeviceId();
  return await axiosInstance.post(`/api/login`, {
    params: {
      // "username": "test",
      // "password": "test@123",
      // device_id: '123',
      ...payload,
      device_id,
    },
  });
}
