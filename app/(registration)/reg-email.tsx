import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { verifyEmail1, verifyEmail2 } from '@/lib/appwrite';

const RegEmail = () => {
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [isDisabled, setIsDisabled] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const secret = urlParams.get('secret');
  const userId = urlParams.get('userId');

  if (secret && userId) {
    verifyEmail2(secret, userId);
  }

  const handleConnect = () => {
    console.log('Send Email verification button pressed');
    verifyEmail1(); // Call your email verification function here
    setTimer(300); // Start a 5-minute timer (300 seconds)
    setIsDisabled(true);
  };

  useEffect(() => {
    let interval : any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsDisabled(false); // Re-enable the button when the timer ends
    }
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <SafeAreaView className="bg-secondary w-full h-full items-center justify-center gap-5">
      {/* Title */}
      <View className="w-full items-center justify-center mt-5">
        <Text className="text-5xl pt-3 font-pmedium border-b-2 border-primary">
          Verify Email
        </Text>
      </View>

      {/* Description */}
      <View className="w-[80%] items-center mb-5">
        <Text className="text-lg text-primary font-pregular text-center">
          We need to verify your email address to ensure the security of your account.
          {'\n'}Please check your inbox for a verification email and follow the instructions to complete the process.
        </Text>
      </View>

      {/* Connect Button */}
      <TouchableOpacity
        onPress={handleConnect}
        disabled={isDisabled}
        className={`w-[80%] rounded-xl p-4 items-center bg-primary`}
      >
        <Text className="text-secondary text-xl font-pmedium">
          {isDisabled ? `Retry in ${formatTime(timer)}` : 'Send Email Verification'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default RegEmail;