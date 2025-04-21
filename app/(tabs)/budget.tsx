import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import PieChart from "react-native-pie-chart"
import { router, useFocusEffect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getBudgetData, getExpenses } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import { useIsFocused } from '@react-navigation/native'

const Budget = () => {
  const { data: budgetInfo, refetch: refetch1 } = useAppwrite(getBudgetData)
  const {data: totals, refetch: refetch2} = useAppwrite(getExpenses)
  const [refreshing, setRefreshing] = useState(false)
  const [hasRefreshed, setHasRefreshed] = useState(false);
  console.log(totals)
 const widthAndHeight = 250

 const categories = [
  "Rent/Utilities",
  "Groceries",
  "Transport",
  "Restaurants",
  "Entertainment",
  "Shopping",
  "Subscription/Services",
  "Others",
];

const getCategoryColor = (category) => {
  switch (category) {
    case "Rent/Utilities":
      return "#E64736"; // Bright Red-Orange (#E64736)
    case "Groceries":
      return "#76CE96"; // Fresh Mint Green (#76CE96)
    case "Transport":
      return "#437BD1"; // Vivid Blue (#437BD1)
    case "Restaurants":
      return "#FF3FA4"; // Electric Pink (#FF3FA4)
    case "Entertainment":
      return "#F4B800"; // Bold Golden Yellow (#F4B800)
    case "Shopping":
      return "#A348D5"; // Vibrant Purple (#A348D5)
    case "Subscription/Services":
      return "#00B8D9"; // Bright Cyan-Blue (#00B8D9)
    default:
      return "#D16E43"; // Burnt Sienna (#D16E43)
  }
};


const totalSum = Object.values(totals || {}).reduce((sum, value) => sum + value, 0);

 const data = categories
 .filter((category) => totals?.[category] > 0) // Only include categories that exist in totals and have a value > 0
 .map((category) => {
   const value = totals?.[category] || 0; // Get the value for the category or default to 0
   const percentage = totalSum > 0 ? (value / totalSum) * 100 : 0; // Calculate percentage
   return {
     value: percentage * 10, // Scale percentage to 0-1000 range
     color: getCategoryColor(category), // Assign a color based on the category
     label: {
       text: percentage < 5 ? "" : `${percentage.toFixed(0)}%`, // Conditional text for labels // Format percentage with 1 decimal place
       fontSize: 15,
       fontWeight: "bold",
     },
   };
 });

 const isDataValid = totalSum > 0;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    console.log(budgetInfo.expenses.length)
    console.log(budgetInfo.$id);
    refetch1();
    refetch2().finally(() => setRefreshing(false));
  }, [refetch1,refetch2]);


  ////this loads the page once and refetches the information once every time the page is opened
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      console.log('In inFocused Block', isFocused);
      refetch1();
      refetch2();
    }
  }, [isFocused]);

  return (
    <SafeAreaView className=' bg-black mb-20 p-5 justify-center'>
      <ScrollView 
      className={"bg-primary"}
        // contentContainerStyle={} 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className='gap-5 items-center'>
          <Text className='text-black font-psemibold text-3xl mt-6'>Monthly Budget</Text>
          <Text className='text-secondary font-psemibold text-4xl'>{'£' + budgetInfo?.budgetAmount || '£ 0'}</Text>
          <View className='justify-center items-center'>
            <Text className= {`font-pmedium text-gray justify-center absolute items-center text-4xl ${budgetInfo?.amountSpent < budgetInfo?.budgetAmount ? "text-gray" : "text-red-500"}`} >{'£' + budgetInfo?.amountSpent || '£ 0'}</Text>
            {isDataValid ? (
              <PieChart
                widthAndHeight={widthAndHeight}
                series={data.map((item) => ({
                value: item.value, // Pass the value
                color: item.color,
                label: item.label, // Pass the color
                }))}// Pass the values to the PieChart
                cover={0.65}
                padAngle={0.02}
              />
            ) : (
              <Text className="text-gray-500 text-lg mt-4">
                No data available for the chart
              </Text>
            )}
          </View>
            <View className="flex-shrink gap-5 py-5 min-h-[10%] bg-secondary-50 rounded-xl p-5 justify-center items-start">
              {Object.keys(totals || {})
                .filter((category) => totals[category] > 0) // Only include categories with values > 0
                .map((category) => {
                  const value = totals[category];
                  const percentage = totalSum > 0 ? (value / totalSum) * 100 : 0; // Calculate percentage
                  return (
                    <Text key={category} className="font-pmedium text-lg">
                      {category}: £{value.toFixed(2)} ({percentage.toFixed(1)}%)
                    </Text>
                  );
                })}
            </View>
          <TouchableOpacity
            onPress={() => { router.push({
              pathname: '/(budget)/enter-expense',
              params: {
                budgetId: budgetInfo?.$id, // Existing parameter
                amountSpent: budgetInfo?.amountSpent, // Existing parameter
                budgetAmount: budgetInfo?.budgetAmount, // New parameter
                userId: budgetInfo?.userId, // New parameter
              }, // Pass budgetInfo.$id as a parameter
            }); 
          }} 
            className='bg-secondary w-[80%] h-[10%] justify-center items-center rounded-xl' 
            activeOpacity={0.7}
          >
            <Text className='text-primary text-xl font-pmedium'>
              Enter expense Manually
            </Text>
          </TouchableOpacity>
            <TouchableOpacity 
              className='bg-gray-100 w-[150px] h-[10%] justify-center items-center rounded-xl' 
              activeOpacity={0.7}
              onPress={() => { router.push("/(budget)/predict-budget") }}
              >
              <Text className='text-primary text-sm font-pmedium'>
                See predicted budget
              </Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Budget
