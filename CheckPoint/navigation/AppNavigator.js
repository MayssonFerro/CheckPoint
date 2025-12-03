import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import FeedScreen from '../screens/FeedScreen';
import GameSearchScreen from '../screens/GameSearchScreen';
import AddReviewScreen from '../screens/AddReviewScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

const RootNavigation = () => {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken ? (
          // App Stack
          <>
            <Stack.Screen name="Feed" component={FeedScreen} />
            <Stack.Screen name="GameSearch" component={GameSearchScreen} options={{ title: 'Buscar Jogos' }} />
            <Stack.Screen name="AddReview" component={AddReviewScreen} options={{ title: 'Escrever Review' }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Meu Perfil' }} />
          </>
        ) : (
          // Auth Stack
          <>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RootNavigation;
