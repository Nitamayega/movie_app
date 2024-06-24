import React from 'react'
import { View, Text, Button } from 'react-native'
import commonStyles from '../styles/commonStyles'

export default function MovieDetail({ navigation }: any): JSX.Element {
    return (
        <View style={commonStyles.container}>
            <Text>Movie Detail</Text>
            <Button
                title="Go to Home"
                onPress={() => navigation.navigate('Home')} />
        </View>
    )
}