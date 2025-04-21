import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker'; // Install this package if not already installed
import { useLocalSearchParams } from 'expo-router';
import { newExpense, updateSpentData } from '@/lib/appwrite';

const EnterExpense = () => {
  const { budgetId, amountSpent, budgetAmount, userId } = useLocalSearchParams();
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const categories = [
    { label: 'Rent/Utilities', value: 'Rent/Utilities' },
    { label: 'Groceries', value: 'Groceries' },
    { label: 'Transport', value: 'Transport' },
    { label: 'Restaurants', value: 'Restaurants' },
    { label: 'Entertainment', value: 'Entertainment' },
    { label: 'Shopping', value: 'Shopping' },
    { label: 'Subscription/Services', value: 'Subscription/Services' },
    { label: 'Others', value: 'Other' },
  ];

  const handleSubmit = () => {
    if (!shopName || !category || !amount) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    console.log(typeof amountSpent)
    const currentAmountSpent = parseFloat(amountSpent) || 0; // Fallback to 0 if amountSpent is undefined or null
    const newAmountSpent = currentAmountSpent + parseFloat(amount); // Add the new amount
    // Handle the form submission logic here
    newExpense(shopName, category, parseFloat(amount), budgetId)
    updateSpentData(budgetId, newAmountSpent)
    console.log('Expense Submitted:', { shopName, category, amount });
    Alert.alert('Success', 'Expense added successfully!');
    console.log('Budget ID:', budgetId, amountSpent); // Log the budgetId for debugging
    console.log("here")
    setShopName('');
    setCategory('');
    setAmount('');
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-secondary justify-center">
      <View className="gap-4">
        {/* Shop Name Input */}
        <View>
          <Text className="text-lg font-semibold mb-2">Shop Name</Text>
          <TextInput
            value={shopName}
            onChangeText={setShopName}
            placeholder="Enter shop name"
            placeholderTextColor='black'
            className="bg-white p-3 rounded-lg border border-gray-300"
          />
        </View>

        {/* Category Dropdown */}
        <View>
          <Text className="text-lg font-semibold mb-2">Category of Expense</Text>
          <View className="bg-white rounded-lg border border-gray-300 overflow-hidden">
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              itemStyle={{ color: 'black' }} // Set the text color to black
            >
              <Picker.Item label="Select a category" value="" />
              {categories.map((cat) => (
                <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Amount Input */}
        <View>
          <Text className="text-lg font-semibold mb-2">Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            placeholderTextColor='black'
            keyboardType="numeric"
            className="bg-white p-3 rounded-lg border border-gray-300"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-secondary border-2 border-white p-4 rounded-lg items-center mt-4"
        >
          <Text className="text-white text-lg font-semibold">Submit Expense</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EnterExpense;