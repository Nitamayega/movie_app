import React, { useEffect, useState } from 'react';
import { View, StatusBar, StyleSheet, FlatList, Dimensions, TouchableOpacity, Alert, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MovieItem from '../components/movies/MovieItem';
import type { Movie } from '../types/app';
import { useIsFocused } from '@react-navigation/native';

const Favorite = (): JSX.Element => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const { width } = Dimensions.get('window');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchFavoriteMovies();
    }
  }, [isFocused]);

  const fetchFavoriteMovies = async (): Promise<void> => {
    try {
      const favoriteMoviesData: string | null = await AsyncStorage.getItem('@FavoriteList');
      if (favoriteMoviesData) {
        const favoriteMoviesList: Movie[] = JSON.parse(favoriteMoviesData);
        setFavoriteMovies(favoriteMoviesList);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to load favorite movies.');
    }
  };

  const renderSeparator = (): JSX.Element => {
    return <View style={styles.separator} />;
  };

  return (
    <View style={styles.container}>
      {favoriteMovies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You haven't selected any favorite movies yet.</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteMovies}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.itemContainer}>
              <MovieItem
                movie={item}
                size={{ width: width / 3 - 32, height: (width / 3 - 32) * 1.5 }} // Adjust size accordingly
                coverType="poster"
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          numColumns={3} // Set to 3 columns
          ItemSeparatorComponent={renderSeparator}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight ?? 32,
    flex: 1,
    paddingHorizontal: 16,
  },
  listContainer: {
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  itemContainer: {
    padding: 8,
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default Favorite;
