import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

const Literature = () => {
  const resources = [
    {
      title: "Student Finance England",
      description: "Official government service for student loans, grants, and financial support. Essential for applying for and managing your student loans.",
      url: "https://www.gov.uk/student-finance"
    },
    {
      title: "UCAS - Student Finance",
      description: "Comprehensive information about student finance options, application process, and available support for university students.",
      url: "https://www.ucas.com/finance"
    },
    {
      title: "Save the Student",
      description: "Essential guide to student budgeting, loans, and money-saving tips. Includes student budget calculator and cost of living guides.",
      url: "https://www.savethestudent.org/"
    },
    {
      title: "MoneySavingExpert - Student Guide",
      description: "Expert advice on student banking, loans, and budgeting. Includes best student bank accounts and money-saving tips.",
      url: "https://www.moneysavingexpert.com/students/"
    },
    {
      title: "MoneyHelper - Student Money",
      description: "Government-backed service with specific advice for students on managing money, loans, and financial planning.",
      url: "https://www.moneyhelper.org.uk/en/your-money/student-money"
    },
    {
      title: "National Union of Students (NUS)",
      description: "Student union resources for financial support, advice, and access to student discounts and benefits.",
      url: "https://www.nus.org.uk/en/advice/money/"
    },
    {
      title: "The Student Room - Money",
      description: "Active student community forum with peer advice on managing finances at university and real student experiences.",
      url: "https://www.thestudentroom.co.uk/forumdisplay.php?f=72"
    },
    {
      title: "The Student Money Manual",
      description: "Comprehensive guide to managing money as a student, including budgeting templates and financial planning tools.",
      url: "https://www.moneyadviceservice.org.uk/en/corporate/student-money-manual"
    },
    {
      title: "Money and Pensions Service - Young People",
      description: "Resources specifically designed for young people's financial wellbeing and long-term financial planning.",
      url: "https://moneyandpensionsservice.org.uk/2021/01/19/young-people-and-money/"
    },
    {
      title: "Student Beans",
      description: "Student discounts and deals to help save money on everyday purchases and entertainment.",
      url: "https://www.studentbeans.com/uk"
    }
  ];

  const handlePress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className='gap-5 items-center'>
          <Text className='text-black border-secondary-50 border-b-2 font-psemibold text-4xl mt-6'>Student Financial Resources</Text>
          
          <View className='w-[90%] bg-white p-5 rounded-xl'>
            <Text className='text-black font-pmedium text-lg mb-4'>
              Student Finance & Money Management
            </Text>
            
            <Text className='text-gray-600 font-pregular text-base mb-6'>
              Below are official and trusted resources specifically designed to help students manage their finances. These resources provide free advice on student loans, budgeting, and money-saving tips.
            </Text>

            {resources.map((resource, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handlePress(resource.url)}
                className='bg-secondary-50 p-4 rounded-lg mb-4'
              >
                <Text className='text-black font-pmedium text-lg mb-2'>
                  {resource.title}
                </Text>
                <Text className='text-gray-600 font-pregular text-base'>
                  {resource.description}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => router.back()}
              className='w-full h-[55px] justify-center items-center rounded-xl bg-secondary mt-4'
            >
              <Text className='text-primary text-lg font-pmedium'>
                Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Literature
