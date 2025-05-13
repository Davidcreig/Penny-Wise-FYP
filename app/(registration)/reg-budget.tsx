import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { newIncome } from '@/lib/appwrite';

const RegBudget = () => {
  const [form, setForm] = useState({
    income: '',
    startDay: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const { income, startDay } = form;

    if (!income || !startDay) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    const startDayInt = parseInt(startDay, 10);
    if (isNaN(startDayInt) || startDayInt < 1 || startDayInt > 31) {
      Alert.alert('Error', 'Please enter a valid day of the month (1-31).');
      return;
    }

    setIsSubmitting(true);

    try {
      await newIncome(parseFloat(income)); // start day is not implemented, but is a good feature for future implementation
      router.replace('/(registration)/reg-loan');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save budget information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-secondary w-full h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 items-center justify-center gap-5"
      >
        <View className="w-full items-center justify-center mt-5">
          <Text className="text-5xl pt-3 font-pmedium border-b-2 border-primary">
            Budget Setup
          </Text>
        </View>
        <View className="w-[80%] items-center mb-5">
          <Text className="text-lg text-primary font-pregular">
            To set up your budget, we need to know your monthly income or the amount of money you have available each month (student loans). 
            Additionally, let us know which day of the month you'd like your budget to start. 
            This will help us track your expenses effectively.
          </Text>
        </View>

        {/* Income Input */}
        <View className="w-full items-center">
          <TextInput
            value={form.income}
            onChangeText={(e) => setForm({ ...form, income: e })}
            className="bg-primary font-pmedium border-2 w-[80%] p-5 border-secondary-50 focus:border-secondary rounded-xl"
            placeholderTextColor="#9fdcb5"
            placeholder="Monthly Income (£)"
            keyboardType="numeric"
          />
        </View>

        {/* Start Day Input */}
        <View className="w-full items-center">
          <TextInput
            value={form.startDay}
            onChangeText={(e) => setForm({ ...form, startDay: e })}
            className="bg-primary font-pmedium border-2 w-[80%] p-5 border-secondary-50 focus:border-secondary rounded-xl"
            placeholderTextColor="#9fdcb5"
            placeholder="Start Day of Month (1-28)"
            keyboardType="numeric"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          className="w-[80%] rounded-xl p-4 bg-primary items-center"
        >
          <Text className="text-secondary text-xl font-pmedium">
            {isSubmitting ? 'Saving...' : 'Save Budget Info'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegBudget;