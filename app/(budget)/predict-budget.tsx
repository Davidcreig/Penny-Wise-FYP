import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PieChart from "react-native-pie-chart"
import { router } from 'expo-router'

const predBudget = () => {

  const enterExpense = async () => {

  };

  const widthAndHeight = 250

    const data = [
      { value: 200, color: '#f4b800', label: { text: '45%',fontSize: 15, fontWeight: 'bold' } },
      { value: 160, color: '#76CE96', label: { text: '33%',fontSize: 15,fontWeight: 'bold' } },
      { value: 500, color: '#437BD1', label: { text: '22%', fontSize: 15,fontWeight: 'bold' } },
      { value: 140, color: '#E64736', label: { text: '5%', fontSize: 15,fontWeight: 'bold' } },
    ]

  return (
    <SafeAreaView className='bg-white h-full'>
      <View className='gap-5 items-center'>
        <Text className='text-black font-psemibold text-4xl mt-6'>Monthly Budget</Text>
        <Text className='text-secondary font-psemibold text-4xl'>£1300</Text>
        <View className='justify-center items-center'>
          <Text className='font-pmedium text-gray justify-center absolute items-center text-4xl'>531.11</Text>
        <PieChart widthAndHeight={widthAndHeight} series={data} cover={0.65} padAngle={0.015}/>
        </View>
        <View className=' flex-grow gap-3  justify-center items-center'>
          <View className='font-pbold'>
            <Text className='font-pmedium'>Rent</Text>
          </View>
          <View>
            <Text className='font-pmedium'>Groceries</Text>
          </View>
          <View>
            <Text className='font-pmedium'>Transport</Text>
          </View>
          <View>
            <Text className='font-pmedium'>Others</Text>
          </View>
          <TouchableOpacity className='bg-gray-100  w-[150px] h-[10%] justify-center items-center rounded-xl' activeOpacity={0.7}
          >
          <Text className='text-primary text-sm font-pmedium'>
            See predicted budget
          </Text>
        </TouchableOpacity>
        </View>
        <TouchableOpacity className='bg-secondary w-[80%] h-[10%] justify-center items-center rounded-xl' activeOpacity={0.7}>
          <Text className='text-primary text-xl font-pmedium'>
            Enter expense Manually
          </Text>

        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default predBudget