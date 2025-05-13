import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { getBudgetData, deleteExpense, updateSpentData } from '@/lib/appwrite'; 
import useAppwrite from '@/lib/useAppwrite';

const EditExpenses = () => {
  const { data: budgetData, refetch } = useAppwrite(getBudgetData); // Fetch budget data
  const [groupedExpenses, setGroupedExpenses] = useState({});

  useEffect(() => {
    if (budgetData?.expenses) {
      // Group expenses by category
      const grouped = budgetData.expenses.reduce((acc, expense) => {
        const { type } = expense; // Use 'type' for category
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(expense);
        return acc;
      }, {});
      setGroupedExpenses(grouped);
    }
  }, [budgetData]);

  const handleDelete = (expenseId, expenseAmount) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete the expense
              await deleteExpense(expenseId);

              // Update the spent amount
              const newSpentAmount = budgetData.amountSpent - expenseAmount;
              await updateSpentData(budgetData.$id, newSpentAmount);

              // Refetch budget data to update the UI
              refetch();
            } catch (error) {
              console.error('Error deleting expense or updating spent amount:', error);
            }
          },
        },
      ]
    );
  };

  const renderCategory = ({ item: [type, expenses] }) => (
    <View key={type} className="w-full mb-5">
      {/* Category Title */}
      <Text className="text-xl font-pmedium text-secondary mb-3">{type}</Text>
  
      {/* List of Expenses */}
      {expenses
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by latest date first
        .map((expense, index) => (
          <TouchableOpacity
            key={index}
            onLongPress={() => handleDelete(expense.$id, expense.amount)} // Pass expense ID and amount
            className="bg-secondary-50 p-4 rounded-lg mb-2"
          >
            <Text className="text-lg font-pmedium text-black">
              From: {expense.shop}
            </Text>
            <Text className="text-lg font-pmedium text-black">
              Amount: £{expense.amount.toFixed(2)}
            </Text>
            <View className="w-full items-end">
                <Text className="text-md font-pmedium text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                </Text>
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );8

  return (
    <SafeAreaView className="bg-primary h-full items-center">
      <View className="items-center w-[80%] justify-center mt-5">
        <Text className="text-5xl pt-5 font-pmedium border-b-2 border-secondary-50">
          Expenses
        </Text>
      </View>
      <FlatList
        className="bg-primary w-[90%] mx-5 my-5 py-5 rounded-xl"
        contentContainerStyle={{ paddingBottom: 20 }}
        data={Object.entries(groupedExpenses)}
        keyExtractor={([type]) => type}
        renderItem={renderCategory}
        ListEmptyComponent={
          <Text className="text-lg font-pmedium text-gray-500">
            No expenses available.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default EditExpenses;