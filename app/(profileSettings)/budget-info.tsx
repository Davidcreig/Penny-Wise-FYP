import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { newIncome } from '@/lib/appwrite'

const budgetInfo = () => {
  const [form, setForm] = useState({
                  income: '',
                  budget:''
              })
      
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submit = async () => {
      if(!form.income){
              Alert.alert('Error','Please fill in all the fields')
          }
  
          setIsSubmitting(true);
  
          try {

              await newIncome(parseFloat(form.income));
  
              //set global state
              Alert.alert('Success', 'Income set successfully')
              router.replace('/(tabs)/budget')
  
          } catch (error) {
              console.log(error)
          }
          finally{
              setIsSubmitting(false)
          }
  }
  return (
    <SafeAreaView className='items-center gap-2'>
        <View>
        <Text>budgetInfo</Text>
        </View>
        <View className='w-full  items-center'>
          <TextInput value={form.income} onChangeText={(e)=>setForm({ ...form, income: e})} className='bg-primary font-pmedium border-2 w-[90%] p-5 border-secondary-50 focus:border-secondary rounded-full' placeholderTextColor={"#9fdcb5"} placeholder='Income'/>
        </View>
        {/* <View className='w-full  items-center'>
          <TextInput value={form.budget} onChangeText={(e)=>setForm({ ...form, income: e})} className='bg-primary font-pmedium border-2 w-[90%] p-5 border-secondary-50 focus:border-secondary rounded-full' placeholderTextColor={"#9fdcb5"} placeholder='Income'/>
        </View> */}
        <TouchableOpacity  onPress={submit} className='w-[90%] rounded-full p-4 bg-secondary items-center'>
          <Text className='text-primary text-xl font-pmedium'>Set new income amount </Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default budgetInfo