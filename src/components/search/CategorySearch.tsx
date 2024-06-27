import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { API_ACCESS_TOKEN } from '@env';

type Genre = {
  id: number;
  name: string;
};

const CategorySearch = (): JSX.Element => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async (): Promise<void> => {
    const url = `https://api.themoviedb.org/3/genre/movie/list`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = (genreId: number) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genreId)
        ? prevSelected.filter((id) => id !== genreId)
        : [...prevSelected, genreId]
    );
  };

  const navigation = useNavigation();

  const handleSearch = () => {
    navigation.dispatch(StackActions.push('CategorySearchResult', { selectedGenres, genres }));
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF3EA5" />
      ) : (
        <>
          {genres.map((genre) => (
            <TouchableOpacity
              key={genre.id}
              activeOpacity={0.6}
              style={[
                styles.genreButton,
                {
                  backgroundColor: selectedGenres.includes(genre.id) ? '#0002A1' : '#4E97F3',
                },
              ]}
              onPress={() => handlePress(genre.id)}
            >
              <Text style={styles.genreLabel}>{genre.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    height: 30,
    marginBottom: 8,
    borderRadius: 10,
  },
  genreLabel: {
    color: '4c2e3c',
    fontSize: 18,
    fontWeight: '400',
    textTransform: 'capitalize',
    fontWeight: 'bold',
    },
  searchButton: {
    backgroundColor: '#0002A1',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '100%',
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchButtonText: {
    color: '#fed3cd',
    fontSize: 26,
    fontWeight: 'bold',
    textTransform: 'uppercase',
   },
});

export default CategorySearch;
