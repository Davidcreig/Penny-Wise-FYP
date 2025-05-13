import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Image } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import PieChart from "react-native-pie-chart"
import { router, useFocusEffect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getBudgetData, getBudgetSpent, getExpenses } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import { useIsFocused } from '@react-navigation/native'
import { icons } from '@/constants'

const Budget = () => {
  const { data: budgetInfo, refetch: refetch1 } = useAppwrite(getBudgetData)
  const {data: totals, refetch: refetch2} = useAppwrite(getExpenses)
  const {data: spent, refetch: refetch3} = useAppwrite(getBudgetSpent)
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
     value: percentage * 10, // Scale percentage to 0-1000 range for pie chart
     color: getCategoryColor(category), // Assign a color based on the category
     label: {
       text: percentage < 5 ? "" : `${percentage.toFixed(0)}%`, // Conditional text for labels // Format percentage with 1 decimal place
       fontSize: 15,
       fontWeight: "bold",
     },
   };
 });

 const isDataValid = totalSum > 0;
//Not being used
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
      console.log('In inFocused Block budget', isFocused);
      refetch1();
      refetch2();
    }
  }, [isFocused]);

  return (
    <SafeAreaView className=' bg-primary h-full pb-5 justify-center'>
      <ScrollView 
      className={"bg-primary"}
        // contentContainerStyle={} 
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
      >
        <View className='pb-24 items-center flex-grow'>
          <Text className='text-black font-psemibold text-3xl mt-6'>{new Date().toLocaleString('default', { month: 'long' })}'s Budget</Text>
          <View className='flex-row items-center justify-center'>
            <Text className='text-secondary font-psemibold pt-3 text-5xl'>{'£' + budgetInfo?.budgetAmount || '£ 0'}</Text>
            <TouchableOpacity
              className=" pr-2 py-3 justify-center "
              onPress={() => { router.push(
                '/(profileSettings)/budget-info'
              ); 
            }} 
            >
              <Image
              source={icons.edit}
              className='w-8 h-8'
              />
            </TouchableOpacity>
          </View>
          <View className='justify-center min-w-[70%] min-h-[100px] my-2 items-center'>
            <Text className= {`font-pmedium text-gray justify-center absolute items-center text-4xl 
              ${budgetInfo?.amountSpent < budgetInfo?.budgetAmount ? "text-gray" : "text-red-500"}`} >{'£' + budgetInfo?.amountSpent || '£ 0'}</Text>
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
              <Text className="text-gray-500 absolute bottom-0  text-lg mt-4">
                No data available for the chart
              </Text>
            )}
          </View>
          <View className='w-full flex-row p-1 mr-8 justify-end items-center px-6'>
            <Text className='text-black font-psemibold text-3xl w-[80%] pl-2 '>Expenses</Text> 
            <TouchableOpacity
              onPress={() => router.push('/(budget)/literature')}
              className="bg-secondary p-2 rounded-full"
            >
              <Text className="font-psemibold text-primary px-2 text-sm">i</Text>
            </TouchableOpacity>
          </View>
          <View className='border-2 border-secondary-50 rounded-xl gap-1'>
            <ScrollView
              className="gap-5 max-h-[135px] p-5 min-h-[10%] min-w-[80%] bg-primary rounded-xl"
              contentContainerStyle={{ alignContent: "flex-start", justifyContent: "center", paddingBottom: 20 }}
            >
              {isDataValid ? (
                Object.keys(totals || {})
                .filter((category) => totals[category] > 0) // Only include categories with values > 0
                .map((category) => {
                  const value = totals[category];
                  const percentage = totalSum > 0 ? (value / totalSum) * 100 : 0; // Calculate percentage
                  return { category, value, percentage }; // Return an object with category, value, and percentage
                })
                .sort((a, b) => b.percentage - a.percentage) // Sort by percentage in descending order
                .map(({ category, value, percentage }) => (
                  <View key={category} className="bg-secondary-50 rounded-lg p-1 mb-1 ">
                    <Text className="font-pmedium text-lg">
                      {category}: £{value.toFixed(2)} ({percentage.toFixed(1)}%)
                    </Text>
                  </View>
                ))
              ) : (
                <View className='w-full h-full items-center '>
                  <Text className="text-gray-500 font-pmedium items-center justify-center text-lg">
                    No expenses
                  </Text>
                </View>
                )}
            </ScrollView>
            
              <TouchableOpacity 
              className= "rounded-xl min-h-[5%]  items-center justify-center bg-primary " 
              onPress={() => {router.push('/(budget)/edit-expenses')}}>
                <Text className="font-pmedium text-lg">
                  See all expenses
                </Text>
              </TouchableOpacity>
            </View>
          <View className='gap-3 mt-3 w-full items-center justify-center'>
          <TouchableOpacity
            onPress={() => { router.push({
              pathname: '/(budget)/enter-expense',//send parameters to the page
              params: {
                budgetId: budgetInfo?.$id,
                amountSpent: budgetInfo?.amountSpent,
                budgetAmount: budgetInfo?.budgetAmount,
                userId: budgetInfo?.userId,
              },
            }); 
          }} 
            className='bg-secondary w-[80%] h-[8%] min-h-[55px] justify-center items-center rounded-xl' 
            activeOpacity={0.7}
          >
            <Text className='text-primary text-xl font-pmedium'>
              Enter expense Manually
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className='bg-gradient-to-r from-blue-500 to-purple-600 w-[80%] min-h-[55px] justify-center items-center rounded-xl bg-blue-200' 
            activeOpacity={0.7}
            onPress={() => { router.push("/(budget)/predict-budget") }}
          >
            <View className="flex-row items-center justify-center gap-2">
              <Text className='text-white text-lg font-pmedium'>
                AI Budget Insights
              </Text>
              <Text className="text-white text-2xl">🤖</Text>
            </View>
          </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Budget
