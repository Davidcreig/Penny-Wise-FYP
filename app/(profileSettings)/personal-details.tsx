import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { getCurrentAccount, updatePassword } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';
import { useIsFocused } from '@react-navigation/native';


const personalDetails = () => {
  const { data: CurrentAccount, refetch: refetch1 } = useAppwrite(getCurrentAccount)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isFocused = useIsFocused();

  // States for form fields
  const [form, setForm] = useState({
    name: 'John', 
    email: 'john@example.com', 
    oldPassword: '',
    newPassword: '',
  });

  
    useEffect(() => {
      if (isFocused) {
        console.log('In inFocused Block', isFocused);
        refetch1();
        console.log('CurrentAccount', CurrentAccount);
      }
    }, [isFocused]);

  return (
    <SafeAreaView className="items-center justify-center h-full bg-primary gap-5">
      {/* Title */}
      <View className=" items-center w-[80%] justify-center mt-5">
        <Text className="text-5xl pt-3 font-pmedium border-b-2 border-secondary-50">
          Profile Information
        </Text>
      </View>

      {/* Name Field */}
      <View className="w-[80%] p-5 rounded-xl border-2 border-gray-300 flex-row gap-3 items-center">
        <Text className="text-secondary-200 font-pmedium text-lg">
          Username:
        </Text>
        <Text className="text-gray-400 font-pmedium text-md">
          {CurrentAccount.name}
        </Text>
      </View>

      {/* Email Field */}
      <View className="w-[80%] p-5 rounded-xl border-2 border-gray-300 flex-row gap-3 items-center">
        <Text className="text-secondary-200 font-pmedium text-lg">
          Email:
        </Text>
        <Text className="text-gray-400 font-pmedium text-md">
          {CurrentAccount.email}
        </Text>
      </View>

      

      {/* Submit Button */}
      <TouchableOpacity
        onPress={updatePassword}
        disabled={isSubmitting}
        className={`w-[80%] rounded-xl p-4 ${
          isSubmitting ? 'bg-gray-400' : 'bg-secondary'
        } items-center`}
      >
        <Text className="text-primary text-xl font-pmedium">
          {isSubmitting ? 'Updating...' : 'Change Password'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default personalDetails;