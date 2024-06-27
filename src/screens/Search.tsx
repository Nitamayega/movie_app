import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import KeywordSearch from '../components/search/KeywordSearch';
import CategorySearch from '../components/search/CategorySearch';

const SearchScreen = (): JSX.Element => {
  const [selectedBar, setSelectedBar] = useState<string>('keyword');

  const getButtonStyle = (item: string, index: number) => ({
    ...styles.topBar,
    borderBottomWidth: item === selectedBar ? 2 : 0,
    borderBottomColor: item === selectedBar ? '#8978A4' : 'transparent',
  });

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>What would you like to watch?</Text>
        <View style={styles.topBarContainer}>
          {['keyword', 'category'].map((item: string, index: number) => (
            <TouchableOpacity
              key={item}
              activeOpacity={0.9}
              style={getButtonStyle(item, index)}
              onPress={() => setSelectedBar(item)}
              accessibilityLabel={`Search by ${item}`}
            >
              <Text style={styles.topBarLabel}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedBar === 'keyword' ? <KeywordSearch /> : <CategorySearch />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#BCD2FF',
    height: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  topBarContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  topBar: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: 40,
  },
  topBarLabel: {
    fontSize: 18,
    fontWeight: '400',
    textTransform: 'capitalize',
  },
});

export default SearchScreen;
