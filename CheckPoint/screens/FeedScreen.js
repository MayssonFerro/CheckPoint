import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getFeedReviews } from '../api/reviewService';

const FeedScreen = ({ navigation }) => {
  const { userToken } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [userToken]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6400" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <Text style={styles.username}>{item.user?.username || 'Unknown User'}</Text>
      <Text style={styles.rating}>Rating: {item.rating}/10</Text>
      <Text style={styles.opinion}>{item.opinion}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
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
  reviewItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  username: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    marginBottom: 5,
  },
  rating: {
    color: '#888',
    marginBottom: 5,
    fontFamily: 'Roboto_400Regular',
  },
  opinion: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#ff6400',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default FeedScreen;
