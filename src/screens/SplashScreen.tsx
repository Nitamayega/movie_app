import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Home from './Home'

export default function App() {
    useEffect(() => {
        async function prepare() {
            try {
                await SplashScreen.hideAsync();
            } catch (error) {
                console.warn(error);
            }
        }
        prepare();
    }, []);

    return (
        <View style={styles.container}>
            <Home />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7266B8',
    },
});
