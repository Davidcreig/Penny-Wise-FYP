import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import Checkbox from 'expo-checkbox'

const GDPR = () => {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <SafeAreaView className='bg-secondary h-full'>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className='gap-5 items-center'>
          <Text className='text-black font-psemibold text-4xl mt-6'>Data Protection</Text>
          
          <View className='w-[90%] bg-white p-5 rounded-xl'>
            <Text className='text-black font-pmedium text-lg mb-4'>
              Data Protection and Privacy Notice
            </Text>
            
            <Text className='text-gray-600 font-pregular text-base mb-4'>
              Penny Wise is committed to protecting your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </Text>

            <Text className='text-gray-600 font-pregular text-base mb-4'>
              By using our app, you agree that we may:
            </Text>

            <View className='mb-4'>
              <Text className='text-gray-600 font-pregular text-base mb-2'>• Process your personal and financial data to provide budgeting services</Text>
              <Text className='text-gray-600 font-pregular text-base mb-2'>• Share necessary information with our banking partners (Plaid) for account integration</Text>
              <Text className='text-gray-600 font-pregular text-base mb-2'>• Use your data to generate ML-powered budget predictions and insights</Text>
              <Text className='text-gray-600 font-pregular text-base mb-2'>• Store your data securely in compliance with UK financial regulations</Text>
            </View>

            <Text className='text-gray-600 font-pregular text-base mb-4'>
              Your data rights include:
            </Text>

            <View className='mb-4'>
              <Text className='text-gray-600 font-pregular text-base mb-2'>• Right to access your personal data</Text>
              <Text className='text-gray-600 font-pregular text-base mb-2'>• Right to rectification of inaccurate data</Text>
              <Text className='text-gray-600 font-pregular text-base mb-2'>• Right to erasure of your data</Text>
              <Text className='text-gray-600 font-pregular text-base mb-2'>• Right to data portability</Text>
            </View>

            <Text className='text-gray-600 font-pregular text-base mb-4'>
              For more information about how we handle your data, please refer to our full Privacy Policy available on our website.
            </Text>

            <View className='flex-row items-center mb-6'>
              <Checkbox
                value={isChecked}
                onValueChange={setIsChecked}
                color={isChecked ? '#76CE96' : undefined}
                className='mr-2'
              />
              <Text className='text-gray-600 font-pregular text-base flex-1'>
                I have read and agree to the data protection terms and conditions
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.replace('/(registration)/reg-budget')}
              disabled={!isChecked}
              className={`w-full h-[55px] justify-center items-center rounded-xl ${
                isChecked ? 'bg-secondary' : 'bg-gray-300'
              }`}
            >
              <Text className={`text-lg font-pmedium ${
                isChecked ? 'text-primary' : 'text-gray-500'
              }`}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default GDPR
