import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Switch } from 'react-native';
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
      
      <TextInput
        style={styles.input}
        placeholder="Nota (1-10)"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Plataforma (ex: PC, PS5)"
        value={platformPlayed}
        onChangeText={setPlatformPlayed}
      />

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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  switchValue: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default AddReviewScreen;
