import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlaidLinkComponent } from '../../components/PlaidLink';
import { router } from 'expo-router';

export default function PlaidConnectScreen() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSuccess = () => {
    setIsConnecting(false);
    Alert.alert(
      'Success',
      'Your bank account has been connected successfully!',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleError = (error: Error) => {
    setIsConnecting(false);
    Alert.alert(
      'Connection Error',
      'There was an error connecting your bank account. Please try again.',
      [{ text: 'OK' }]
    );
    console.error('Plaid connection error:', error);
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Header */}
      <View className="items-center justify-center mt-5">
        <Text className="text-5xl pt-3 text-red-500 font-pmedium border-b-2 border-secondary-50">
          Connect to Banl
        </Text>
      </View>

      {/* Description */}
      <View className="w-full items-center mt-5 px-4">
        <Text className="text-lg font-pmedium text-center text-secondary-50">
          Securely connect your bank account using Plaid to track your financial data.
        </Text>
      </View>

      {/* Plaid Link Component */}
      <View className="flex-1 justify-center items-center px-4">
        <PlaidLinkComponent
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </View>

      {/* Back Button */}
      <View className="p-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-full rounded-xl p-4 bg-secondary items-center"
        >
          <Text className="text-primary text-xl font-pmedium">Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}



// const connectPlaid = () => {
//   const handleConnect = () => {
//     // Add your Plaid connection logic here
//     console.log('Connect to Plaid button pressed');
//   };

//   return (
//     <SafeAreaView className="items-center p-5 justify-center h-full bg-primary gap-5">
//       {/* Title */}
//       <View className=" items-center justify-center mt-5">
//         <Text className="text-5xl pt-3 font-pmedium border-b-2 border-secondary-50">
//           Connect to Bank
//         </Text>
//       </View>

//       {/* Description */}
//       <View className="w-full items-center mt-5">
//         <Text className="text-lg font-pmedium text-center text-secondary-50">
//           Securely connect your bank account using Plaid to track your financial data.
//         </Text>
//       </View>

//       {/* Connect Button */}
//       <TouchableOpacity
//         onPress={handleConnect}
//         className="w-[80%] rounded-xl p-4 bg-secondary items-center mt-10"
//       >
//         <Text className="text-primary text-xl font-pmedium">Connect through Plaid</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// export default connectPlaid;