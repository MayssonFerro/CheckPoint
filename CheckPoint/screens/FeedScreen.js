import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getFeedReviews } from '../api/reviewService';

const FeedScreen = ({ navigation }) => {
  const { userToken } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchReviews = async () => {
        try {
          const data = await getFeedReviews(userToken);
          setReviews(data);
        } catch (error) {
          console.error('Failed to fetch reviews', error);
        } finally {
          setLoading(false);
        }
      };

      fetchReviews();
    }, [userToken])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fa801f" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <Text style={styles.gameTitle}>{item.game_name || 'Jogo Desconhecido'}</Text>
      <Text style={styles.rating}>Nota: {item.rating}/10</Text>
      
      {item.game_background_image && (
        <Image source={{ uri: item.game_background_image }} style={styles.gameImage} />
      )}

      <Text style={styles.opinion}>{item.opinion}</Text>
      
      <View style={styles.footer}>
        <Text style={styles.username}>por {item.user?.username || 'Unknown User'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Reviews</Text>}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('GameSearch')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 80, // Add padding to avoid FAB overlap
    paddingTop: 20,
  },
  sectionTitle: {
    fontFamily: 'Ubuntu_700Bold',
    fontSize: 24,
    color: '#fff',
    marginBottom: 15,
  },
  reviewItem: {
    backgroundColor: '#202020',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  gameTitle: {
    fontFamily: 'Ubuntu_700Bold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 2,
  },
  rating: {
    color: '#fa801f',
    marginBottom: 10,
    fontFamily: 'Ubuntu_700Bold',
    fontSize: 14,
  },
  gameImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginBottom: 10,
  },
  opinion: {
    fontSize: 14,
    fontFamily: 'Ubuntu_400Regular',
    color: '#ddd',
    marginBottom: 10,
  },
  footer: {
    alignItems: 'flex-end',
  },
  username: {
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 12,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#fa801f',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default FeedScreen;
