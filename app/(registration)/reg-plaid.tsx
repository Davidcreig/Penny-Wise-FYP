import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const RegPlaid = () => {
  const handleConnect = () => {
    // Add your Plaid connection logic here from plaid-connect.tsx
    console.log('Connect to Plaid button pressed');
  };

  return (
    <SafeAreaView className="bg-secondary w-full h-full items-center justify-center gap-5">
      {/* Title */}
      <View className="w-full items-center justify-center mt-5">
        <Text className="text-5xl pt-3 font-pmedium border-b-2 border-primary">
          Connect to Plaid
        </Text>
      </View>

      {/* Description */}
      <View className="w-[80%] items-center mb-5">
        <Text className="text-lg text-primary font-pregular text-center">
          Securely connect your bank account using Plaid to track your financial data. 
          This will help us provide better insights into your spending and budgeting.
        </Text>
      </View>

      {/* Connect Button */}
      <TouchableOpacity
        onPress={handleConnect}
        className="w-[80%] rounded-xl p-4 bg-primary items-center"
      >
        <Text className="text-secondary text-xl font-pmedium">Connect to Plaid</Text>
      </TouchableOpacity>

      {/* Skip Button */}
      <TouchableOpacity
        onPress={()=>{router.replace('/(tabs)/budget')}}
        className="w-[80%] rounded-xl p-4 bg-secondary items-center mt-3"
      >
        <Text className="text-primary text-xl font-pmedium">Skip</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default RegPlaid;