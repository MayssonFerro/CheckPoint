import React from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
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
        <ActivityIndicator size="large" color="#ff6400" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ff6400',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontFamily: 'Roboto_700Bold',
          },
          cardStyle: { backgroundColor: '#151515' },
        }}
      >
        {userToken ? (
          // App Stack
          <>
            <Stack.Screen 
              name="CheckPoint" 
              component={FeedScreen} 
              options={({ navigation }) => ({
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ marginRight: 15 }}>
                    <Ionicons name="person-circle-outline" size={30} color="white" />
                  </TouchableOpacity>
                ),
              })}
            />
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
    backgroundColor: '#151515',
  },
});

export default RootNavigation;
