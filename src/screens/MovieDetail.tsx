import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { Movie } from '../types/app';
import MovieItem from '../components/movies/MovieItem';
import { useDarkMode } from '../components/DarkModeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id, coverType } = route.params;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>('');
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    fetchMovieDetail();
    checkIfFavorite();
  }, [id]);

  const fetchMovieDetail = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const movieData = await fetchFromApi(`https://api.themoviedb.org/3/movie/${id}`);
      setMovie(movieData);
      const recommendationData = await fetchFromApi(`https://api.themoviedb.org/3/movie/${id}/recommendations`);
      setRecommendations(recommendationData.results);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to fetch data: ${err.message}`);
        console.error('Error fetching movie detail:', err.message);
      } else {
        setError('An unknown error occurred');
        console.error('An unknown error occurred while fetching movie detail:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFromApi = async (url: string): Promise<any> => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const addFavorite = async (movie: Movie): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      let favMovieList: Movie[] = initialData ? JSON.parse(initialData) : [];
      favMovieList = [...favMovieList, movie];
      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList));
      setIsFavorite(true);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const removeFavorite = async (id: number): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      let favMovieList: Movie[] = initialData ? JSON.parse(initialData) : [];
      favMovieList = favMovieList.filter((movie) => movie.id !== id);
      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList));
      setIsFavorite(false);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const checkIfFavorite = async (): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      const favMovieList: Movie[] = initialData ? JSON.parse(initialData) : [];
      const isFav = favMovieList.some((movie) => movie.id === id);
      setIsFavorite(isFav);
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  };

  const toggleFavorite = (): void => {
    if (movie) {
      if (isFavorite) {
        removeFavorite(movie.id);
      } else {
        addFavorite(movie);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3EA5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  const convertMinutesToHours = (minutes) => {
    if (!minutes || typeof minutes !== 'number') {
      return 'N/A';
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#BCD2FF' }]}>
      <ImageBackground
        resizeMode="cover"
        style={styles.backgroundImage}
        source={{
          uri: `https://image.tmdb.org/t/p/w500${coverType === 'backdrop' ? movie?.backdrop_path : movie?.poster_path}`,
        }}
      >
        <LinearGradient
          colors={['#00000000', 'rgba(0, 0, 0, 0.7)']}
          locations={[0.6, 0.8]}
          style={styles.gradientStyle}
        >
          <View style={styles.ratingFavoriteContainer}>
            <View style={styles.ratingContainer}>
              <FontAwesome name="star" size={18} color="#FB2576" />
              <Text style={styles.rating}>{movie?.vote_average.toFixed(1)}</Text>
            </View>
            <TouchableOpacity onPress={toggleFavorite}>
              <FontAwesome name={isFavorite ? "heart" : "heart-o"} size={24} color="#FB2576" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
      <View style={styles.detailContainer}>
        <Text style={[styles.movieTitle, { color: isDarkMode ? '#FFF' : '#025285' }]}>{movie?.title}</Text>
        <Text style={[{ color: isDarkMode ? '#FFF' : '#025285' }]}>
          {movie?.genres.map((genre, index) => (
            <React.Fragment key={genre.id}>
              {genre.name}
              {index !== movie.genres.length - 1 ? ', ' : ''}
            </React.Fragment>
          ))}
        </Text>
        <Text style={[styles.gridValue, { color: isDarkMode ? '#FFF' : '#025285' }]}>
          Durasi: {convertMinutesToHours(movie?.runtime)}
        </Text>
        <Text style={[styles.overview, { color: isDarkMode ? '#FFF' : '#025285' }]}>{movie?.overview}</Text>
        <View style={styles.gridContainer}>
          <View style={styles.gridItem}>
            <Text style={[styles.gridTitle, { color: isDarkMode ? '#FFF' : '#025285' }]}>Original Language</Text>
            <Text style={[styles.gridValue, { color: isDarkMode ? '#FFF' : '#025285' }]}>{movie?.original_language}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={[styles.gridTitle, { color: isDarkMode ? '#FFF' : '#025285' }]}>Popularity</Text>
            <Text style={[styles.gridValue, { color: isDarkMode ? '#FFF' : '#025285' }]}>{movie?.popularity.toFixed(2)}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={[styles.gridTitle, { color: isDarkMode ? '#FFF' : '#025285' }]}>Release Date</Text>
            <Text style={[styles.gridValue, { color: isDarkMode ? '#FFF' : '#025285' }]}>
              {movie?.release_date ? new Date(movie.release_date).toDateString() : 'N/A'}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={[styles.gridTitle, { color: isDarkMode ? '#FFF' : '#025285' }]}>Vote Count</Text>
            <Text style={[styles.gridValue, { color: isDarkMode ? '#FFF' : '#025285' }]}>{movie?.vote_count}</Text>
          </View>
        </View>
      </View>
      <View style={styles.recommendationsContainer}>
        <View style={styles.recommendationHeader}>
          <View style={[styles.purpleLabel, { backgroundColor: isDarkMode ? '#8978A4' : '#0002A1' }]}></View>
          <Text style={[styles.recommendationsTitle, { color: isDarkMode ? '#FFF' : '#025285' }]}>Rekomendasi</Text>
        </View>
        <FlatList
          horizontal
          data={recommendations}
          renderItem={({ item }) => (
            <MovieItem
              movie={item}
              size={{ width: 100, height: 160 }}
              coverType="poster"
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </ScrollView >
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#BCD2FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: 300,
  },
  movieTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gradientStyle: {
    padding: 8,
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  ratingFavoriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 8,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingLeft: 8,
  },
  rating: {
    color: '#FF7ED4',
    fontWeight: '700',
  },
  detailContainer: {
    padding: 16,
    width: '100%',
  },
  overview: {
    fontSize: 18,
    marginVertical: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  gridValue: {
    fontSize: 14,
  },
  recommendationsContainer: {
    width: '100%',
    paddingLeft: 16,
    marginBottom: 16,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  purpleLabel: {
    width: 20,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8978A4',
    marginRight: 12,
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MovieDetail;