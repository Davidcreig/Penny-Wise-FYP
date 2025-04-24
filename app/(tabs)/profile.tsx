import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { icons } from '../../constants'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { signOut } from '@/lib/appwrite'
import { useGLobalContext } from '@/context/GlobalProvider'

const profile = () => {

  const {user, setUser, setIsLoggedIn} = useGLobalContext();

  const logout = async () => {
    await signOut();
    setUser(null)
    setIsLoggedIn(false)

    router.replace('../(auth)/sign-in')
  }
  return (
    <SafeAreaView className='h-full bg-primary'>
      <View className='items-center h-full'>
        <View className='min-h-[10%] justify-center items-center w-full'>
          <Text className='font-psemibold text-3xl'>User Profile</Text>
        </View>
        <View className=' border-gray-200  border-b-2 w-full'
        />
        <ScrollView className='w-full'>
          <View className='items-center my-7'>
            <View className=' w-[150px] h-[150px] items-center justify-center  mb-3 rounded-full'>
              <Image
              className='w-full h-full rounded-full'
              source={{uri: user?.avatar}}
              resizeMode='contain'
              />
            </View>
            <Text className='font-psemibold capitalize text-2xl'>
              {user?.username}
            </Text>
          </View>
          <View className='w-full items-center'>
            <View className='w-[85%]'>
              <TouchableOpacity onPress={()=>{router.push("../(profileSettings)/budget-info")}} className='flex-row justify-between w-full h-[70px] items-center border-b border-gray-200'>
                <View className='bg-secondary-50 justify-center items-center rounded-2xl p-2'>
                  <Image
                  resizeMode='contain'
                  className='w-10 h-10'
                  source={icons.calculator}
                  />
                </View>
                <Text className='text-black w-[55%] text-left text-lg font-pmedium'>
                  Budget Information
                </Text>
                <Image
                resizeMode='contain'
                className='w-10 h-10'
                source={icons.rightArrowB}/>
              </TouchableOpacity>
            </View>
          </View>
          <View className='w-full items-center'>
            <View className='w-[85%]'>
              <TouchableOpacity className='flex-row justify-between w-full h-[70px] items-center border-b border-gray-200'
              onPress={()=>{router.push("../(profileSettings)/loan-info")}}>
                <View className='bg-secondary-50 justify-center items-center rounded-2xl p-2'>
                  <Image
                  resizeMode='contain'
                  className='w-10 h-10'
                  source={icons.graph}
                  />
                </View>
                <Text className='text-black w-[55%] text-left text-lg font-pmedium'>
                  Student Loan Information
                </Text>
                <Image
                resizeMode='contain'
                className='w-10 h-10'
                source={icons.rightArrowB}/>
              </TouchableOpacity>
            </View>
          </View>
          <View className='w-full items-center'>
            <View className='w-[85%]'>
              <TouchableOpacity className='flex-row justify-between w-full h-[70px] items-center border-b border-gray-200'
              onPress={()=>{router.push("../(profileSettings)/plaid-connect")}}>
                <View className='bg-secondary-50 justify-center items-center rounded-2xl p-2'>
                  <Image
                  resizeMode='contain'
                  className='w-10 h-10'
                  source={icons.bank}
                  />
                </View>
                <Text className='text-black w-[55%] text-left text-lg font-pmedium'>
                  Connnect to your bank
                </Text>
                <Image
                resizeMode='contain'
                className='w-10 h-10'
                source={icons.rightArrowB}/>
              </TouchableOpacity>
            </View>
          </View>
          <View className='w-full items-center'>
            <View className='w-[85%]'>
              <TouchableOpacity className='flex-row justify-between w-full h-[70px] items-center border-b border-gray-200'
              onPress={()=>{router.push("../(profileSettings)/personal-details")}}>
                <View className='bg-secondary-50 justify-center rounded-2xl p-2'>
                  <Image
                  resizeMode='contain'
                  className='w-10 h-10'
                  source={icons.profileB}
                  />
                </View>
                <Text className='text-black text-lg w-[55%] text-left font-pmedium'>
                  Personal details
                </Text>
                <Image
                resizeMode='contain'
                className='w-10 h-10'
                source={icons.rightArrowB}/>
              </TouchableOpacity>
            </View>
          </View>
          <View className='items-center w-full mt-10 '>
            <TouchableOpacity onPress={logout} className='flex-row w-full ml-5 justify-center items-center'>
              <Text className='font-psemibold mt-1'>
                Log Out 
              </Text>
              <Image
                resizeMode='contain'
                className='w-7 h-7 m-2 mt-2.5 '
                source={icons.logout}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default profile