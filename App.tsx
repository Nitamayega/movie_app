import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import BottomTabNavigator from './src/navigations/BottomTabNavigation'
import { DarkModeProvider } from './src/components/DarkModeContext'

export default function App(): JSX.Element {
  return (
    <DarkModeProvider>
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </DarkModeProvider>
  )
}
