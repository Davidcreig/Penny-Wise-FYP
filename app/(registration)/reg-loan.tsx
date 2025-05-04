import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { updateLoanInfo } from '@/lib/appwrite'; // Replace with the actual function to save loan data

const RegLoan = () => {
  const [form, setForm] = useState({
    expectedSalary: '',
    loanPlan: '',
    loanBalance: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const { expectedSalary, loanPlan, loanBalance } = form;

    if (!expectedSalary || !loanPlan || !loanBalance) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    const expectedSalaryFloat = parseFloat(expectedSalary);
    const loanBalanceFloat = parseFloat(loanBalance);

    if (
      isNaN(expectedSalaryFloat) ||
      isNaN(loanBalanceFloat) ||
      loanPlan === ''
    ) {
      Alert.alert('Error', 'Please enter valid numeric values. Loan Plan must be between 1 and 5.');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateLoanInfo(expectedSalaryFloat, loanBalanceFloat, loanPlan); // Assuming this function saves the loan data
      Alert.alert('Success', 'Loan information saved successfully!');
      router.replace('/(registration)/reg-plaid'); // Redirect to the loan prediction page
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save loan information.');
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
            Loan Setup
          </Text>
        </View>
        <View className="w-[80%] items-center mb-5">
          <Text className="text-lg text-primary font-pregular">
            To help you understand your student loans, we need to know your expected salary after graduation, your loan plan (1-5), and your current loan balance. 
            This information will allow us to provide accurate loan visualisation and insights.
          </Text>
        </View>

        {/* Expected Salary Input */}
        <View className="w-full items-center">
          <TextInput
            value={form.expectedSalary}
            onChangeText={(e) => setForm({ ...form, expectedSalary: e })}
            className="bg-primary font-pmedium border-2 w-[80%] p-5 border-secondary-50 focus:border-secondary rounded-xl"
            placeholderTextColor="#9fdcb5"
            placeholder="Expected Salary (£)"
            keyboardType="numeric"
          />
        </View>

        {/* Loan Plan Input */}
        <View className="w-full items-center">
          <TextInput
            value={form.loanPlan}
            onChangeText={(e) => setForm({ ...form, loanPlan: e })}
            className="bg-primary font-pmedium border-2 w-[80%] p-5 border-secondary-50 focus:border-secondary rounded-xl"
            placeholderTextColor="#9fdcb5"
            placeholder="Loan Plan (1-5)"
            keyboardType="numeric"
          />
        </View>

        {/* Loan Balance Input */}
        <View className="w-full items-center">
          <TextInput
            value={form.loanBalance}
            onChangeText={(e) => setForm({ ...form, loanBalance: e })}
            className="bg-primary font-pmedium border-2 w-[80%] p-5 border-secondary-50 focus:border-secondary rounded-xl"
            placeholderTextColor="#9fdcb5"
            placeholder="Loan Balance (£)"
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
            {isSubmitting ? 'Saving...' : 'Save Loan Info'}
          </Text>
        </TouchableOpacity>

        {/* Skip Button */}
        <TouchableOpacity
          onPress={() => {
            router.replace('/(registration)/reg-plaid');
          }}
          className="w-[80%] rounded-xl p-4 bg-secondary items-center mt-3"
        >
          <Text className="text-primary text-xl font-pmedium">Skip</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegLoan;