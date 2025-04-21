import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import{SafeAreaView} from 'react-native-safe-area-context'
import{images} from '../constants';
import { useEffect } from 'react';
import { useGLobalContext } from '@/context/GlobalProvider';


 export default function App() {
    const {isLoading, isLoggedIn} = useGLobalContext();
    if(!isLoading && isLoggedIn) return <Redirect href="/budget"/>
  

  return (
    <SafeAreaView className="bg-secondary w-full h-full">
      <ScrollView className="h-full w-full " >
        <View className="w-full justify-center items-center gap-2 min-h-[85vh]  flex-1">
          <Image
            className="w-[200px] h-[200px]"
            source={images.icon}
            resizeMode='contain'
          />
          <View className=''>
            <Text className='text-5xl w-full p-5 font-psemibold text-primary'>Penny-Wise</Text>
          </View>
          <View className='items-center w-full  justify-center gap-5'>
            <TouchableOpacity
              onPress={()=>router.replace("/(auth)/sign-in")}
              className="bg-primary items-center justify-center h-16 w-[80%] rounded-full"
            >
              <Text className='text-2xl font-pmedium text-secondary'>
                Log in
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>router.replace("/(auth)/sign-up")}
              className="bg-primary items-center justify-center h-16 w-[80%] rounded-full"
            >
              <Text className='text-2xl font-pmedium text-secondary'>
                Sign up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={()=>router.push("/(tabs)/budget")}
              className="bg-primary items-center gap-4 justify-center flex-row h-16 w-[80%] rounded-full"
            >
              <Image
              className='w-10 h-10'
              resizeMode='contain'
              source={images.googleLogo}
              />
              <Text className='text-xl font-pmedium text-black'>
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#76CE96' style='dark'/>
    </SafeAreaView>
  );
}
