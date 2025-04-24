import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker'; // Install this package if not already installed
import { useLocalSearchParams, router } from 'expo-router';
import { newExpense, updateSpentData, getBudgetSpent, getBudgetData } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';

const EnterExpense = () => {
  const { shopName1, amount1, category1} = useLocalSearchParams();
  const { data: budgetInfo, refetch: refetch1 } = useAppwrite(getBudgetData);
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const budgetId = budgetInfo.$id;
  const amountSpent = budgetInfo.amountSpent;
   // Fallback to 0 if spent is undefined or null
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

  useEffect(() => {
    console.log(shopName1, amount1, category1)
    setShopName((shopName1 as string) || ''); // Use passed parameter or leave empty
    setCategory(category1 as string || ''); // Use passed parameter or leave empty
    setAmount(amount1 as string || ''); // Use passed parameter or leave empty
  }, [shopName1, amount1, category1]);

  const handleSubmit = () => {
    if (!shopName || !category || !amount || !budgetId || !(amountSpent >= 0)) {
      // Check if any field is empty or budgetId is undefined
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    console.log(budgetInfo)
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
    router.push('/(tabs)/budget'); // Navigate to the budget page after submission
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