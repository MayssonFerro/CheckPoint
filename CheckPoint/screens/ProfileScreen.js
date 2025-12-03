import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getUserReviews, deleteReview } from '../api/reviewService';

const ProfileScreen = ({ navigation }) => {
  const { userToken, signOut } = useAuth();
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
        <ActivityIndicator size="large" color="#ff6400" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <Button title="Sair" onPress={signOut} color="red" />
      </View>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Roboto_700Bold',
    color: '#fff',
  },
  listContainer: {
    paddingBottom: 80, // Add padding to avoid FAB overlap
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
    fontFamily: 'Roboto_700Bold',
    marginBottom: 5,
  },
  rating: {
    color: '#888',
    marginBottom: 5,
    fontFamily: 'Roboto_400Regular',
  },
  opinion: {
    fontSize: 14,
    marginBottom: 10,
    fontFamily: 'Roboto_400Regular',
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
    fontFamily: 'Roboto_700Bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#ccc',
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

export default ProfileScreen;
