import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Switch, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { createReview, getReviewById, updateReview } from '../api/reviewService';
import { getGameDetails } from '../api/rawg';

const AddReviewScreen = ({ route, navigation }) => {
  const { gameId, gameName, reviewId } = route.params;
  const { userToken } = useAuth();

  const [rating, setRating] = useState('');
  const [opinion, setOpinion] = useState('');
  const [platformPlayed, setPlatformPlayed] = useState('');
  const [recommended, setRecommended] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameDetails, setGameDetails] = useState(null);

  useEffect(() => {
    const fetchGameInfo = async () => {
      if (gameId) {
        try {
          const details = await getGameDetails(gameId);
          setGameDetails(details);
        } catch (error) {
          console.error('Error fetching game details:', error);
        }
      }
    };
    fetchGameInfo();
  }, [gameId]);

  useEffect(() => {
    if (reviewId) {
      setIsEditing(true);
      const fetchReview = async () => {
        try {
          const review = await getReviewById(userToken, reviewId);
          setRating(review.rating.toString());
          setOpinion(review.opinion);
          setPlatformPlayed(review.platform_played || '');
          setRecommended(review.recommended);
        } catch (_error) {
          Alert.alert('Erro', 'Falha ao carregar review para edição.');
          navigation.goBack();
        }
      };
      fetchReview();
    }
  }, [reviewId, userToken, navigation]);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!rating || !opinion) {
      Alert.alert('Erro', 'Por favor, preencha a nota e a opinião.');
      return;
    }

    const numericRating = Number(rating);

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateReview(userToken, reviewId, {
          rating: numericRating,
          opinion,
          recommended,
          platform_played: platformPlayed,
        });
        Alert.alert('Sucesso', 'Review atualizada com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await createReview(userToken, gameId, {
          rating: numericRating,
          opinion,
          recommended,
          platform_played: platformPlayed,
          game_name: gameName,
          game_background_image: gameDetails?.background_image
        });
        Alert.alert('Sucesso', 'Review criada com sucesso!', [
          { text: 'OK', onPress: () => navigation.popToTop() }
        ]);
      }
    } catch (_error) {
      Alert.alert('Erro', isEditing ? 'Falha ao atualizar review.' : 'Falha ao criar review.');
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerInfo}>
            {gameDetails && (
              <Text style={styles.releaseText}>{gameDetails.released}</Text>
            )}
            {gameDetails && gameDetails.background_image && (
              <Image source={{ uri: gameDetails.background_image }} style={styles.coverImage} />
            )}
            <Text style={styles.title}>{gameName}</Text>
            {gameDetails && (
              <Text style={styles.devPubText}>
                {gameDetails.developers?.map(d => d.name).join(', ')} | {gameDetails.publishers?.map(p => p.name).join(', ')}
              </Text>
            )}
          </View>
          
          <Text style={styles.label}>Nota:</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <TouchableOpacity key={num} onPress={() => setRating(num.toString())}>
                <View style={[
                  styles.ratingCircle,
                  { backgroundColor: num <= (parseInt(rating) || 0) ? '#fa801f' : '#ccc' }
                ]}>
                  <Text style={styles.ratingText}>{num}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.label}>Plataforma:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.platformContainer}>
            {['PC', 'PS5', 'PS4', 'Xbox Series', 'Xbox One', 'Switch', 'Mobile'].map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPlatformPlayed(p)}
                style={[
                  styles.platformChip,
                  { backgroundColor: platformPlayed === p ? '#fa801f' : '#ccc' }
                ]}
              >
                <Text style={styles.platformText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Sua opinião"
            placeholderTextColor="#666"
            value={opinion}
            onChangeText={setOpinion}
            multiline
            numberOfLines={4}
          />

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Recomendado?</Text>
            <Switch
              value={recommended}
              onValueChange={setRecommended}
              trackColor={{ false: "#767577", true: "#fa801f" }}
              thumbColor={recommended ? "#fff" : "#f4f3f4"}
            />
            <Text style={styles.switchValue}>{recommended ? 'Sim' : 'Não'}</Text>
          </View>

          {gameDetails && (
            <View style={styles.extraInfoContainer}>
              <Text style={styles.label}>Gêneros:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.platformContainer}>
                {gameDetails.genres?.map((g) => (
                  <View key={g.id} style={[styles.platformChip, { backgroundColor: '#444' }]}>
                    <Text style={[styles.platformText, { color: '#fff' }]}>{g.name}</Text>
                  </View>
                ))}
              </ScrollView>
              
              <View style={styles.metaContainer}>
                <Text style={styles.metaText}>Metacritic: <Text style={{ color: '#fa801f' }}>{gameDetails.metacritic}</Text></Text>
                <Text style={styles.metaText}>Público: <Text style={{ color: '#fa801f' }}>{gameDetails.rating}</Text></Text>
              </View>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]} 
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Enviando..." : (isEditing ? "Atualizar Review" : "Enviar Review")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginBottom: 0,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#151515',
    fontFamily: 'Ubuntu_400Regular',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
    backgroundColor: '#151515',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontFamily: 'Ubuntu_400Regular',
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
    marginBottom: 5,
    color: '#fff',
    fontFamily: 'Ubuntu_400Regular',
  },
  switchValue: {
    fontSize: 16,
    marginLeft: 10,
    color: '#fff',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ratingCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingText: {
    color: '#151515',
    fontSize: 12,
    fontFamily: 'Ubuntu_700Bold',
  },
  platformContainer: {
    height: 40,
    marginBottom: 5,
    flexGrow: 0,
  },
  platformChip: {
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  platformText: {
    color: '#151515',
    fontFamily: 'Ubuntu_700Bold',
  },
  submitButton: {
    backgroundColor: '#fa801f',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Ubuntu_700Bold',
  },
  headerInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  devPubText: {
    color: '#ccc',
    fontSize: 12,
    fontFamily: 'Ubuntu_400Regular',
    marginBottom: 5,
    textAlign: 'center',
  },
  releaseText: {
    color: '#ccc',
    fontSize: 12,
    fontFamily: 'Ubuntu_400Regular',
    marginBottom: 5,
  },
  coverImage: {
    width: 100,
    height: 140,
    borderRadius: 5,
    marginBottom: 10,
  },
  extraInfoContainer: {
    marginBottom: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  metaText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Ubuntu_700Bold',
  },
});

export default AddReviewScreen;
