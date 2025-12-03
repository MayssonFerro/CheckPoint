import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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
      <Text style={styles.gameTitle}>Jogo ID: {item.rawg_game_id}</Text>
      <Text style={styles.rating}>Nota: {item.rating}/10</Text>
      <Text style={styles.opinion}>{item.opinion}</Text>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('AddReview', { reviewId: item._id, gameId: item.rawg_game_id, gameName: `Jogo ${item.rawg_game_id}` })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteReview(item._id)}
        >
          <Text style={styles.buttonText}>Deletar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Meu Perfil</Text>
      <FlatList
        data={userReviews}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>Você ainda não fez nenhuma review.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rating: {
    color: '#888',
    marginBottom: 5,
  },
  opinion: {
    fontSize: 14,
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default ProfileScreen;
