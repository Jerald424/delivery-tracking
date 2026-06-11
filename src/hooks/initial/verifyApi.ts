import axiosInstance from 'src/services/axiosInstance';

export default async function verifyApi({ token }: { token: string }) {
  const response = await axiosInstance.post(
    `/api/token/verify`,
    {
      params: { token },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (response?.result?.status !== 200) throw new Error('Session expires');
  return response;
}
