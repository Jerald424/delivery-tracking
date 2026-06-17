import axiosInstance from 'src/services/axiosInstance';

// "params": {
//     "token": "9c34f4cb-45e5-471a-b833-75e80e67861d",
//     "latitude": 11.34662,
//     "longitude": 77.71909,
//     "driver_id": 2,
//     "bill_no": "BILL-2026-0099",
//     "trip_from": "Erode Warehouse",
//     "trip_to": "Salem Outlet",
//     "item_text": "Spices and Organic Grains",
//     "total_weight": 1250.5
//   }
// }
export const startTripApi = (payload: any) => {
  return axiosInstance.post('/api/start-trip', {
    params: payload,
  });
};

// {
//  "params": {
//  "trip_id": 1,
//  "latitude": 12.9720,
//  "longitude": 77.5950,
//  "speed": 45.5,
//  "accuracy": 10.0,
//  "tracking_time": "2026-06-04 10:30:00"
//  }
// }

/**
 *
 * @returns 2026-06-04 10:30:00
 */
export const makeJsDateToFormatDate = () => {
  const date = new Date();

  const formatted =
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0') +
    ' ' +
    String(date.getHours()).padStart(2, '0') +
    ':' +
    String(date.getMinutes()).padStart(2, '0') +
    ':' +
    String(date.getSeconds()).padStart(2, '0');

  return formatted;
};
export const updateLocationApi = params => {
  return axiosInstance.post('/api/location-update', { params });
};
