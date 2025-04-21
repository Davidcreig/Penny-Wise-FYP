import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons, images } from '../../constants'
import { Link, router } from 'expo-router'
import { signIn } from '@/lib/appwrite'

const SignIn = () => {
    const [form, setForm] = useState({
                email: '',
                password:''
            })
    
        const [isSubmitting, setIsSubmitting] = useState(false)
    
        const submit = async () => {
            if(!form.email || !form.password){
                    Alert.alert('Error','Please fill in all the fields')
                }
        
                setIsSubmitting(true);
        
                try {

                    await signIn(form.email,form.password)
        
                    //set global state
        
                    router.replace('/(tabs)/budget')
                } catch (error) {
                    console.log(error)
                }
                finally{
                    setIsSubmitting(false)
                }
        }

    const [showPassword, setShowPassword] = useState(true)
  return (
    <SafeAreaView className='bg-secondary h-full items-center'>
            <ScrollView contentContainerClassName='justify-center py-10 ' className='bg-primary w-[90%] mx-5 my-10 py-5 rounded-[35px]'>
                <View className='items-center gap-10'>
                    <Image
                        className="w-[150px] h-[150px]"
                        source={images.icon}
                        resizeMode='contain'
                    />

                    <View className=''>
                        <Text className='text-2xl w-full font-psemibold text-secondary'>Log in to Penny-Wise</Text>
                    </View>
                    <View className='w-full  items-center'>
                        <TextInput value={form.email} onChangeText={(e)=>setForm({ ...form, email: e})} className='bg-primary font-pmedium border-2 w-[90%] p-5 border-secondary-50 focus:border-secondary rounded-full' placeholderTextColor={"#9fdcb5"} placeholder='Email'/>
                    </View>
                    <View className='w-[90%] flex-row rounded-full items-center'>
                        <TextInput value={form.password} onChangeText={(e)=>setForm({ ...form, password: e})} className='bg-primary border-2 border-secondary-50 font-pmedium w-[100%] p-5 rounded-full focus:border-secondary'placeholderTextColor={"#9fdcb5"} secureTextEntry={showPassword} placeholder='Password'/>
                        <TouchableOpacity className='w-10 right-12 h-10 items-center justify-center' onPress={()=>{setShowPassword(!showPassword)}}>
                            <Image
                            className='w-7 h-7'
                            source={showPassword ? icons.eye : icons.eyeHide}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity  onPress={submit} className='w-[90%] rounded-full p-4 bg-secondary items-center'>
                        <Text className='text-primary text-xl font-pmedium'>Log in </Text>
                    </TouchableOpacity>
                    <View className="justify-center flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Don't have an account?
                        </Text>
                        <Link href="/sign-up" className="text-lg font-psemibold text-secondary">
                            Sign up
                        </Link>
                    </View>
                </View>
            </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn