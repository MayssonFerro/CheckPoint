import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider } from './context/AuthContext';
import RootNavigation from './navigation/AppNavigator';
import { useFonts, Ubuntu_400Regular, Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';

export default function App() {
  let [fontsLoaded] = useFonts({
    Ubuntu_400Regular,
    Ubuntu_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#17354a' }}>
        <ActivityIndicator size="large" color="#fa801f" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
