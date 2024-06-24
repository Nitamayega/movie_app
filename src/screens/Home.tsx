import React from 'react'
import { View, Text, Button } from 'react-native'
import commonStyles from '../styles/commonStyles'

export default function Home({ navigation }: any): JSX.Element {
    return (
        <View style={commonStyles.container}>
            <Text>Home</Text>
            <Button
                title="Go to Movie Detail"
                onPress={() => navigation.navigate('MovieDetail')} />
        </View>
    )
}