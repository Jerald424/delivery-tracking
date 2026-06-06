import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'src/hooks/useTheme';
import Tracker from 'src/screens/tracker';
import TripDetails from 'src/screens/tripDetails';
import fonts from 'src/utils/fonts';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTitleStyle: {
          color: colors.background,
          fontFamily: fonts.title,
        },
        headerTintColor: colors.background,
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={Tracker}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Trip Details" component={TripDetails} />
    </Stack.Navigator>
  );
}
