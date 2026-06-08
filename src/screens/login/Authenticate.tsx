import HMAButton from 'src/components/styled/atoms/button';
import axiosInstance from 'src/services/axiosInstance';
const auth = () => {
  return axiosInstance.post('web/session/authenticate', {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      db: 'allwin_watertank',
      login: 'admin',
      password: 'allwinwt@!~19',
    },
  });
};
export default function Authenticate() {
  const handlePress = () => {
    auth()
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };
  return <HMAButton title="Authenticate" onPress={handlePress} />;
}
