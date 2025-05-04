import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons, images } from '../../constants'
import { Link, router } from 'expo-router'
import {createUser} from '../../lib/appwrite'


const SignUp = () => {

    const [showPassword, setShowPassword] = useState(true)
    const [repeatedPass, setRepeatedPass] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)


    const [form, setForm] = useState({
            username : "",
            email: '',
            password:''
        })

    const capitalizeFirstLetter = (text: string) => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
        };

    const submit = async () => {
        if (form.password !== repeatedPass) {  
        Alert.alert('Error', 'Passwords do not match');
        return
        }
        if(!form.username || !form.email || !form.password){
            Alert.alert('Error','Please fill in all the fields')
            return;
        }

        setIsSubmitting(true);

        try {
            await createUser(form.email,form.password,form.username)
            console.log('hi')
            //set global state 

            router.replace('/(registration)/reg-budget')
        } catch (error) {
            console.log(error)
        }
        finally{
            setIsSubmitting(false)
        }
    }

  return (
    <SafeAreaView className='bg-secondary h-full items-center'>
            <ScrollView contentContainerClassName='justify-center py-5 ' className='bg-primary w-[90%] mx-5 my-10 py-5 rounded-[35px]'>
                <View className='items-center gap-5'>
                    <Image
                        className="w-[100px] h-[100px]"
                        source={images.icon}
                        resizeMode='contain'
                    />
                    <View className=''>
                        <Text className='text-2xl w-full font-psemibold text-secondary'>Sign up to Penny-Wise</Text>
                    </View>
                    <View className='w-full items-center'>
                        <TextInput value={form.username} onChangeText={(e)=>setForm({ ...form, username: capitalizeFirstLetter(e)})} className='bg-primary font-pmedium border-2 w-[90%] p-5 border-secondary-50 focus:border-secondary rounded-full' placeholderTextColor={"#9fdcb5"} placeholder='Username'/>
                    </View>
                    <View className='w-full items-center'>
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
                    <View className='w-[90%] flex-row rounded-full items-center'>
                                            <TextInput value={repeatedPass}  onChangeText={(e)=>setRepeatedPass(e)} className= {`bg-primary border-2 border-secondary-50 font-pmedium w-[100%] p-5 rounded-full ${form.password == repeatedPass ? 'border-secondary focus:border-secondary' : 'border-red-500 focus:border-red-500'} `}
                                            placeholderTextColor={"#9fdcb5"} secureTextEntry={showPassword} placeholder='Repeat password'/>
                                            <TouchableOpacity className='w-10 right-12 h-10 items-center justify-center' onPress={()=>{setShowPassword(!showPassword)}}>
                                                <Image
                                                className='w-7 h-7'
                                                source={showPassword ? icons.eye : icons.eyeHide}
                                                />
                                            </TouchableOpacity>
                                        </View>
                    <TouchableOpacity onPress={submit} className='w-[90%] rounded-full p-4 bg-secondary items-center'>
                        <Text className='text-primary text-xl font-pmedium'>Sign up </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    // onPress={()=>router.push("/(tabs)/budget")}
                    className="bg-primary border border-gray-200 w-[90%] items-center gap-4 justify-center flex-row h-16 rounded-full"
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
                    <View className="justify-center flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Already have an account?
                        </Text>
                        <Link href="/sign-in" className="text-lg font-psemibold text-secondary">
                            Log In
                        </Link>
                    </View>
                </View>
            </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp