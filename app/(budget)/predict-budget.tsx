import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BarChart } from 'react-native-chart-kit'
import { Dimensions } from 'react-native'

type Category = 'Rent/Utilities' | 'Groceries' | 'Transport' | 'Restaurants' | 'Entertainment' | 'Shopping' | 'Subscription/Services' | 'Other';

const predBudget = () => {
  const categories: Category[] = [
    'Rent/Utilities',
    'Groceries',
    'Transport',
    'Restaurants',
    'Entertainment',
    'Shopping',
    'Subscription/Services',
    'Other'
  ];
  const daysOfMonth = Array.from({ length: 30 }, (_, i) => (i + 1).toString()); // Days 1-30

  const mockData: Record<Category, number[]> = {
    'Rent/Utilities': Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 400), // Random data between 400-500
    'Groceries': Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 200), // Random data between 200-300
    'Transport': Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 100), // Random data between 100-200
    'Restaurants': Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 150), // Random data between 150-250
    'Entertainment': Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 50), // Random data between 50-150
    'Shopping': Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 100), // Random data between 100-200
    'Subscription/Services': Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 50), // Random data between 50-150
    'Other': Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 50), // Random data between 50-150
  };

  const renderBarChart = (category: Category, data: number[]) => (
    <View key={category} className='mb-4'>
      <Text className='text-black font-psemibold text-xl mb-2'>{category}</Text>
      <BarChart
        data={{
          labels: daysOfMonth,
          datasets: [{ data }],
        }}
        width={Dimensions.get('window').width - 40}
        height={220}
        yAxisLabel="£"
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: "#FFFAFA",
          backgroundGradientTo: "#FFFAFA",
          color: (opacity = 1) => `rgba(118, 206, 150, ${opacity})`,
          decimalPlaces: 0,
          barPercentage: 0.5, // This controls the width of the bars
        }}
        style={{ marginVertical: 2, borderRadius: 16 }}
      />
    </View>
  );

  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className='gap-5 items-center'>
          <Text className='text-black font-psemibold text-4xl mt-6'>Predicted Expenses (ML)</Text>
          {categories.map((category) => renderBarChart(category, mockData[category]))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default predBudget;