import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getFeedReviews } from '../api/reviewService';

const FeedScreen = ({ navigation }) => {
  const { userToken, signOut } = useAuth();
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
        <ActivityIndicator size="large" />
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
      <View style={styles.header}>
        <Button title="Logout" onPress={signOut} color="red" />
        <Button title="Perfil" onPress={() => navigation.navigate('Profile')} />
        <Button title="Nova Review" onPress={() => navigation.navigate('GameSearch')} />
      </View>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
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
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  rating: {
    color: '#888',
    marginBottom: 5,
  },
  opinion: {
    fontSize: 14,
  },
});

export default FeedScreen;
