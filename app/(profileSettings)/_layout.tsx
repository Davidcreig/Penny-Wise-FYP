import { View, Text } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'

const ProfileLayout = () => {
  return (
    <>
        <Stack>
            <Stack.Screen name = "budget-info" options={{headerShown: false}}/>
            <Stack.Screen name = "loan-info" options={{headerShown: false}}/>
            <Stack.Screen name = "personal-details" options={{headerShown: false}}/>
            <Stack.Screen name = "plaid-connect" options={{headerShown: false}}/>
        </Stack>
        <StatusBar backgroundColor={"#FFFAFA"}/>
        </>
  )
}

export default ProfileLayout