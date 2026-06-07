import { Alert, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function useBackHandle(
  isActive: boolean,
  onShowPrompt?: () => void,
) {
  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isActive) {
          onShowPrompt?.();
          return true; // blocked ✅
        }
        return false; // allow back if trip not started
      },
    );

    return () => backHandler.remove();
  });
}
