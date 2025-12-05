import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getUserReviews, deleteReview } from '../api/reviewService';

const ProfileScreen = ({ navigation }) => {
  const { userToken } = useAuth();
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const data = await getUserReviews(userToken);
        setUserReviews(data);
      } catch (error) {
        console.error('Failed to fetch user reviews', error);
      } finally {
        setLoading(false);
      }
    };

    if (userToken) {
      fetchUserReviews();
    } else {
      // no user token: ensure state is reset and loading is false
      setUserReviews([]);
      setLoading(false);
    }
  }, [userToken]);

  const handleDeleteReview = async (reviewId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta review?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReview(userToken, reviewId);
              setUserReviews(userReviews.filter((review) => review._id !== reviewId));
              Alert.alert('Sucesso', 'Review excluída com sucesso.');
            } catch (_error) {
              Alert.alert('Erro', 'Falha ao excluir review.');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.gameTitle}>{item.game_name || `Jogo ${item.rawg_game_id}`}</Text>
          <Text style={styles.rating}>Nota: {item.rating}/10</Text>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('AddReview', { reviewId: item._id, gameId: item.rawg_game_id, gameName: item.game_name || `Jogo ${item.rawg_game_id}` })}
          >
            <Ionicons name="pencil" size={20} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleDeleteReview(item._id)}
          >
            <Ionicons name="trash" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>

      {item.game_background_image && (
        <Image source={{ uri: item.game_background_image }} style={styles.gameImage} />
      )}

      <Text style={styles.opinion}>{item.opinion}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fa801f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={userReviews}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Você ainda não fez nenhuma review.</Text>}
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
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 80, // Add padding to avoid FAB overlap
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  gameTitle: {
    fontFamily: 'Ubuntu_700Bold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 2,
  },
  rating: {
    color: '#fa801f',
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
  actionsContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#ccc',
    fontFamily: 'Ubuntu_400Regular',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 40,
    backgroundColor: '#fa801f',
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default ProfileScreen;
