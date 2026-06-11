import axiosInstance from 'src/services/axiosInstance';

export const fetchActiveTrip = ({ token }: { token: string }) => {
  return axiosInstance.post('api/user/profile', {
    params: {
      token,
    },
  });
};
