import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker'; // Install this package if not already installed
import { router } from 'expo-router';
import { updateLoanInfo } from '@/lib/appwrite';

const LoanInfo = () => {

  // States for input fields
  const [form, setForm] = useState({
    income: '',
    totalDebt: '',
    loanType: '',
  });

  const loanTypes = [
    { label: 'Plan 1', value: '1' },
    { label: 'Plan 2', value: '2' },
    { label: 'Plan 3', value: '3' },
    { label: 'Plan 4', value: '4' },
    { label: 'Plan 5', value: '5' },
  ];

  const handleSubmit = async () => {
    if (!form.income || !form.totalDebt || !form.loanType) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      Alert.alert('Success', 'Loan information submitted successfully!');
      updateLoanInfo(form.income, form.totalDebt, form.loanType); // Call the function to update loan info
      router.push('/(tabs)/budget'
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit loan information.');
    }
  };

  return (
    <SafeAreaView className="items-center justify-center h-full bg-primary gap-5">
      {/* Title */}
      <View className=" items-center w-[80%] justify-center mt-5">
        <Text className="text-5xl pt-3 font-pmedium border-b-2 border-secondary-50">Loan Information</Text>
      </View>

      {/* Income Input */}
      <View className="w-full items-center">
        <TextInput
          value={form.income}
          onChangeText={(e) => setForm({ ...form, income: e })}
          className="bg-primary font-pmedium border-2 w-[80%] p-5 border-secondary-50 focus:border-secondary rounded-xl"
          placeholderTextColor="#9fdcb5"
          placeholder="Expected Annual Income (£)"
          keyboardType="numeric"
        />
      </View>

      {/* Total Debt Input */}
      <View className="w-full items-center">
        <TextInput
          value={form.totalDebt}
          onChangeText={(e) => setForm({ ...form, totalDebt: e })}
          className="bg-primary font-pmedium border-2 w-[80%] p-5 border-secondary-50 focus:border-secondary rounded-xl"
          placeholderTextColor="#9fdcb5"
          placeholder="Total Student Loan (£)"
          keyboardType="numeric"
        />
      </View>

      {/* Loan Type Picker */}
      <View className="w-full items-center">
        <View className="bg-primary font-pmedium border-2 w-[80%] p-2 border-secondary-50 focus:border-secondary rounded-xl">
          <Picker
            selectedValue={form.loanType}
            onValueChange={(itemValue) => setForm({ ...form, loanType: itemValue })}
            style={{ color: '#9fdcb5' }}
          >
            <Picker.Item label="Select Loan Type" value="" />
            {loanTypes.map((type) => (
              <Picker.Item key={type.value} label={type.label} value={type.value} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        className="w-[80%] rounded-xl p-4 bg-secondary items-center"
      >
        <Text className="text-primary text-xl font-pmedium">Submit Loan Info</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoanInfo;