import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, Alert, Image, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getUserReviews, deleteReview } from '../api/reviewService';

const ProfileScreen = ({ navigation }) => {
  const { userToken } = useAuth();
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchUserReviews = async () => {
        try {
          const data = await getUserReviews(userToken);
          setUserReviews(data);
        } catch (error) {
          console.error('Falha ao buscar reviews do usuário', error);
        } finally {
          setLoading(false);
        }
      };

      if (userToken) {
        fetchUserReviews();
      } else {
        setUserReviews([]);
        setLoading(false);
      }
    }, [userToken])
  );

  const handleDeleteReview = (reviewId) => {
    setReviewToDelete(reviewId);
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    try {
      await deleteReview(userToken, reviewToDelete);
      setUserReviews(userReviews.filter((review) => review._id !== reviewToDelete));
      setModalVisible(false);
      setSuccessModalVisible(true);
    } catch (_error) {
      setModalVisible(false);
      Alert.alert('Erro', 'Falha ao excluir review.');
    } finally {
      setReviewToDelete(null);
    }
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            <Text style={styles.modalText}>Tem certeza que deseja excluir esta review?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]} 
                onPress={confirmDelete}
              >
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={50} color="#4CAF50" style={{ marginBottom: 10 }} />
            <Text style={styles.modalTitle}>Sucesso!</Text>
            <Text style={styles.modalText}>Review excluída!</Text>
            <TouchableOpacity 
              style={[styles.modalButton, styles.okButton]} 
              onPress={() => setSuccessModalVisible(false)}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 80,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#202020',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    color: '#fff',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'Ubuntu_400Regular',
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#444',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  okButton: {
    backgroundColor: '#4CAF50',
    marginTop: 10,
    width: '100%',
    flex: 0,
    marginHorizontal: 0,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Ubuntu_700Bold',
    fontSize: 14,
  },
});

export default ProfileScreen;
