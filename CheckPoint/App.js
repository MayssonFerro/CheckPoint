import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider } from './context/AuthContext';
import RootNavigation from './navigation/AppNavigator';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

export default function App() {
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#17354a' }}>
        <ActivityIndicator size="large" color="#ff6400" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
