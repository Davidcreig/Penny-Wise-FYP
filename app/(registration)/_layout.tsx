import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const RegistrationLayout = () => {
  return (
    <>
    <Stack>
      <Stack.Screen name = "reg-email" options={{headerShown: false}}/>
      <Stack.Screen name = "reg-budget" options={{headerShown: false}}/>
      <Stack.Screen name = "reg-loan" options={{headerShown: false}}/>
      <Stack.Screen name = "reg-plaid" options={{headerShown: false}}/>
      <Stack.Screen name = "GDPR" options={{headerShown: false}}/>
    </Stack>
    <StatusBar backgroundColor={"#76CE96"}/>
    </>
  )
}

export default RegistrationLayout