import React, { useState } from 'react';
import { ScrollView, View, StatusBar, StyleSheet, ImageBackground, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDarkMode } from '../components/DarkModeContext';
import type { MovieListProps } from '../types/app';
import MovieList from '../components/movies/MovieList';

const movieLists: MovieListProps[] = [
  {
    title: 'Now Playing in Theater',
    path: 'movie/now_playing?language=en-US&page=1',
    coverType: 'backdrop',
  },
  {
    title: 'Upcoming Movies',
    path: 'movie/upcoming?language=en-US&page=1',
    coverType: 'poster',
  },
  {
    title: 'Top Rated Movies',
    path: 'movie/top_rated?language=en-US&page=1',
    coverType: 'poster',
  },
  {
    title: 'Popular Movies',
    path: 'movie/popular?language=en-US&page=1',
    coverType: 'poster',
  },
];

const HomeScreen = (): JSX.Element => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <ScrollView>
      <ImageBackground
        source={require('../../assets/splash.png')}
        style={styles.banner}
        imageStyle={styles.bannerImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0)']}
          style={styles.gradient}
        />
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleDarkMode}
        >
          <Text style={styles.toggleButtonText}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</Text>
        </TouchableOpacity>
      </ImageBackground>
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#BCD2FF' }]}>
        {movieLists.map((movieList, index) => (
          <MovieList
            title={movieList.title}
            path={movieList.path}
            coverType={movieList.coverType}
            key={index}
          />
        ))}
        <StatusBar translucent={false} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  banner: {
    height: 190,
  },
  bannerImage: {
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 190,
  },
  container: {
    paddingTop: StatusBar.currentHeight ?? 32,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 16,
  },
  toggleButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
  },
  toggleButtonText: {
    color: '#FFF',
  },
});

export default HomeScreen;
