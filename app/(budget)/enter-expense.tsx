import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { newExpense, updateSpentData, getBudgetData } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';

const EnterExpense = () => {
  const { shopName1, amount1, category1, date1 } = useLocalSearchParams();
  const { data: budgetInfo } = useAppwrite(getBudgetData);
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const budgetId = budgetInfo?.$id;
  const amountSpent = budgetInfo?.amountSpent;

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
    setShopName((shopName1 as string) || '');
    setCategory((category1 as string) || '');
    setAmount((amount1 as string) || '');
    if (date1) {
      setDate(new Date(date1 as string));
    }
  }, [shopName1, amount1, category1, date1]);

  const handleSubmit = () => {
    if (!shopName || !category || !amount || !budgetId || !(amountSpent >= 0)) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const currentAmountSpent = parseFloat(amountSpent) || 0;
    const newAmountSpent = currentAmountSpent + parseFloat(amount);

    newExpense(shopName, category, parseFloat(amount), budgetId, date.toISOString());
    updateSpentData(budgetId, newAmountSpent);

    Alert.alert('Success', 'Expense added successfully!');
    setShopName('');
    setCategory('');
    setAmount('');
    setDate(new Date());
    router.push('/(tabs)/budget');
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <SafeAreaView className="items-center justify-center h-full bg-primary gap-5">
      {/* Title */}
      <View className="items-center w-[80%] justify-center mt-5">
        <Text className="text-5xl pt-3 font-pmedium border-b-2 border-secondary-50">
          Enter Expense
        </Text>
      </View>

      {/* Shop Name Input */}
      <View className="w-full items-center">
        <TextInput
          value={shopName}
          onChangeText={setShopName}
          className="bg-primary font-pmedium border-2 w-[80%] p-5 border-secondary-50 focus:border-secondary rounded-xl"
          placeholderTextColor="#9fdcb5"
          placeholder="Shop Name"
        />
      </View>

      {/* Category Dropdown */}
      <View className="w-full items-center">
        <View className="bg-primary font-pmedium border-2 w-[80%] p-2 border-secondary-50 focus:border-secondary rounded-xl">
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={{ color: '#9fdcb5' }}
          >
            <Picker.Item label="Select a category" value="" />
            {categories.map((cat) => (
              <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Amount Input */}
      <View className="w-full items-center">
        <TextInput
          value={amount}
          onChangeText={setAmount}
          className="bg-primary font-pmedium border-2 w-[80%] p-5 border-secondary-50 focus:border-secondary rounded-xl"
          placeholderTextColor="#9fdcb5"
          placeholder="Amount (£)"
          keyboardType="numeric"
        />
      </View>

      {/* Date Picker */}
      <View className="w-full items-center">
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="bg-primary font-pmedium border-2 w-[80%] p-5 border-secondary-50 focus:border-secondary rounded-xl"
        >
          <Text className="text-secondary">{date.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        className="w-[80%] rounded-xl p-4 bg-secondary items-center"
      >
        <Text className="text-primary text-xl font-pmedium">Submit Expense</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EnterExpense;