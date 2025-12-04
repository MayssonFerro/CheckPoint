import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { searchGames } from '../api/rawg';

const GameSearchScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm) {
        setLoading(true);
        try {
          const results = await searchGames(searchTerm);
          setSearchResults(results);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('AddReview', { gameId: item.id, gameName: item.name })}
    >
      <Image source={{ uri: item.background_image }} style={styles.gameImage} />
      <Text style={styles.gameTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Procure um jogo..."
        placeholderTextColor="#666"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#fa801f" style={styles.loader} />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            searchTerm && !loading ? <Text style={styles.emptyText}>Nenhum jogo encontrado</Text> : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 50,
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#202020',
    color: '#fff',
    fontFamily: 'Ubuntu_400Regular',
  },
  loader: {
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  gameImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  gameTitle: {
    fontSize: 16,
    fontFamily: 'Ubuntu_700Bold',
    flex: 1,
    color: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#ccc',
    fontFamily: 'Ubuntu_400Regular',
  },
});

export default GameSearchScreen;
