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
        placeholder="Search for a game..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#ff6400" style={styles.loader} />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            searchTerm && !loading ? <Text style={styles.emptyText}>No games found</Text> : null
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
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
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
    fontFamily: 'Roboto_700Bold',
    flex: 1,
    color: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#ccc',
    fontFamily: 'Roboto_400Regular',
  },
});

export default GameSearchScreen;
