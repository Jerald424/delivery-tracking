import axiosInstance from 'src/services/axiosInstance';

/*
{
 "params": {
 "latitude": 12.9750,
 "longitude": 77.5990,
 "expenses": [
 {
 "type": "fuel",
 "amount": 500,
 "description": "Petrol refill"
 }
 ]
 }
}
*/
export const endTripApi = ({
  params,
  trip_id,
}: {
  params: any;
  trip_id: number;
}) => {
  return axiosInstance.post(`/api/end-trip/${trip_id}`, { params });
};
