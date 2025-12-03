import React from 'react';
import { AuthProvider } from './context/AuthContext';
import RootNavigation from './navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
