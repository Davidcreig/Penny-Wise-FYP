import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const budgetLayout = () => {
  return (
    <>
    <Stack>
        <Stack.Screen name = "predict-budget" options={{headerShown: false}}/>
        <Stack.Screen name = "enter-expense" options={{headerShown: false}}/>
    </Stack>
    <StatusBar backgroundColor={"#76CE96"}/>
    </>
  )
}

export default budgetLayout