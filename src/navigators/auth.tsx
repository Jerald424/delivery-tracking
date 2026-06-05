import { createStackNavigator } from '@react-navigation/stack';
import HMAText from 'src/components/styled/atoms/text';
import { useTheme } from 'src/hooks/useTheme';
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
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
}

const Dashboard = ()=>{
  return <HMAText>DASHBOARD</HMAText>
}