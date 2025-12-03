import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { createReview, getReviewById, updateReview } from '../api/reviewService';

const AddReviewScreen = ({ route, navigation }) => {
  const { gameId, gameName, reviewId } = route.params;
  const { userToken } = useAuth();

  const [rating, setRating] = useState('');
  const [opinion, setOpinion] = useState('');
  const [platformPlayed, setPlatformPlayed] = useState('');
  const [recommended, setRecommended] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

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
    if (!rating || !opinion) {
      Alert.alert('Erro', 'Por favor, preencha a nota e a opinião.');
      return;
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 10) {
      Alert.alert('Erro', 'A nota deve ser um número entre 1 e 10.');
      return;
    }

    try {
      if (isEditing) {
        await updateReview(userToken, reviewId, {
          rating: numericRating,
          opinion,
          recommended,
          platform_played: platformPlayed,
        });
        Alert.alert('Sucesso', 'Review atualizada com sucesso!', [
          { text: 'OK', onPress: () => navigation.navigate('Profile') }
        ]);
      } else {
        await createReview(userToken, gameId, {
          rating: numericRating,
          opinion,
          recommended,
          platform_played: platformPlayed,
        });
        Alert.alert('Sucesso', 'Review criada com sucesso!', [
          { text: 'OK', onPress: () => navigation.navigate('Feed') }
        ]);
      }
    } catch (_error) {
      Alert.alert('Erro', isEditing ? 'Falha ao atualizar review.' : 'Falha ao criar review.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEditing ? 'Atualizar Review' : `Adicionar Review para ${gameName}`}</Text>
      
      <Text style={styles.label}>Nota:</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <TouchableOpacity key={num} onPress={() => setRating(num.toString())}>
            <View style={[
              styles.ratingCircle,
              { backgroundColor: num <= (parseInt(rating) || 0) ? '#ff6400' : '#ccc' }
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
              { backgroundColor: platformPlayed === p ? '#ff6400' : '#ccc' }
            ]}
          >
            <Text style={styles.platformText}>{p}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Sua opinião"
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
        />
        <Text style={styles.switchValue}>{recommended ? 'Sim' : 'Não'}</Text>
      </View>

      <Button title={isEditing ? "Atualizar Review" : "Enviar Review"} onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Roboto_700Bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontFamily: 'Roboto_400Regular',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontFamily: 'Roboto_400Regular',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
    color: '#fff',
    fontFamily: 'Roboto_400Regular',
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
    color: 'white',
    fontSize: 12,
    fontFamily: 'Roboto_700Bold',
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
    color: 'white',
    fontFamily: 'Roboto_700Bold',
  },
});

export default AddReviewScreen;
