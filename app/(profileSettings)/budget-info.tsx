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
    <SafeAreaView className='items-center justify-center h-full bg-primary  gap-5'>
        <View className='w-full items-center  justify-center   mt-5'>
        <Text className = "text-5xl pt-3 font-pmedium  border-b-2 border-secondary-50 " >Budget Information</Text>
        </View>
        <View className='w-full  items-center'>
          <TextInput value={form.income} onChangeText={(e)=>setForm({ ...form, income: e})} className='bg-primary font-pmedium border-2 w-[80%] p-5 border-secondary-50 focus:border-secondary rounded-xl' placeholderTextColor={"#9fdcb5"} placeholder='Income'/>
        </View>
        {/* <View className='w-full  items-center'>
          <TextInput value={form.budget} onChangeText={(e)=>setForm({ ...form, income: e})} className='bg-primary font-pmedium border-2 w-[90%] p-5 border-secondary-50 focus:border-secondary rounded-full' placeholderTextColor={"#9fdcb5"} placeholder='Income'/>
        </View> */}
        <TouchableOpacity  onPress={submit} className='w-[80%] rounded-xl p-4  bg-secondary items-center'>
          <Text className='text-primary text-xl font-pmedium'>Set new income amount </Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={()=>{router.push("/(budget)/edit-expenses")}} className='w-[80%] rounded-xl p-4  bg-secondary items-center'>
          <Text className='text-primary text-xl font-pmedium'>See expense list </Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default budgetInfo