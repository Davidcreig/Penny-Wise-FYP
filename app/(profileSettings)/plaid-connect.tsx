import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const connectPlaid = () => {
  const handleConnect = () => {
    // Add your Plaid connection logic here
    console.log('Connect to Plaid button pressed');
  };

  return (
    <SafeAreaView className="items-center p-5 justify-center h-full bg-primary gap-5">
      {/* Title */}
      <View className=" items-center justify-center mt-5">
        <Text className="text-5xl pt-3 font-pmedium border-b-2 border-secondary-50">
          Connect to Plaid
        </Text>
      </View>

      {/* Description */}
      <View className="w-full items-center mt-5">
        <Text className="text-lg font-pmedium text-center text-secondary-50">
          Securely connect your bank account using Plaid to track your financial data.
        </Text>
      </View>

      {/* Connect Button */}
      <TouchableOpacity
        onPress={handleConnect}
        className="w-[80%] rounded-xl p-4 bg-secondary items-center mt-10"
      >
        <Text className="text-primary text-xl font-pmedium">Connect to Plaid</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default connectPlaid;