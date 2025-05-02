import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Alert, TouchableWithoutFeedback, Platform, ScrollView, Linking } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getLoanData } from '@/lib/appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAppwrite from '@/lib/useAppwrite';
import { router } from 'expo-router';

// TypeScript interfaces for Repayment data
interface Repayment {
  year: number;
  balance: number;
  annualRepayment: number;
}

// Function to calculate loan repayments over time
const calculateRepayments = (
  income: number,
  initialDebt: number,
  plan: string,
  years: number = 30
): Repayment[] => {
  const plans: Record<string, { threshold: number; rate: number; writeOff: number; interest: number }> = {
    "1": { threshold: 26065, rate: 0.09, writeOff: 25, interest: 0.043 },
    "2": { threshold: 28470, rate: 0.09, writeOff: 30, interest: 0.043 },
    "3": { threshold: 21000, rate: 0.06, writeOff: 30, interest: 0.073 },
    "4": { threshold: 32745, rate: 0.09, writeOff: 30, interest: 0.043 },
    "5": { threshold: 25000, rate: 0.09, writeOff: 40, interest: 0.043 },
  };

  const { threshold, rate, writeOff, interest } = plans[plan];

  let balance = initialDebt;
  let salary = income;
  const repayments: Repayment[] = [];
  const salaryGrowth = 0.02;

  for (let year = 0; year <= Math.min(years, writeOff); year++) {
    const annualRepayment = Math.max((salary - threshold) * rate, 0);
    balance = balance * (1 + interest) - annualRepayment;

    if (balance <= 0 || isNaN(balance) || !isFinite(balance)) {
      balance = Math.max(balance, 0);
      repayments.push({ year, balance, annualRepayment });
      break;
    }

    repayments.push({ year, balance, annualRepayment });
    salary *= 1 + salaryGrowth;
  }

  return repayments;
};

// Student Loan Repayment Chart Component
const StudentLoanChart: React.FC = () => {
  const [data, setData] = useState<Repayment[]>([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [selectedPoint, setSelectedPoint] = useState<{ year: number; balance: number } | null>(null); // State for the selected data point
  const isFocused = useIsFocused();
  const { data: loanData1, refetch: refetch1 } = useAppwrite(getLoanData); // Fetch loan data using Appwrite

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const loanData = await getLoanData(); // Fetch loan data asynchronously
        if (loanData) {
          const { salary, loanBalance, loanPlan } = loanData; // Extract data from loanData
          const repayments = calculateRepayments(salary, loanBalance, loanPlan); // Calculate repayments
          setData(repayments); // Set the calculated data
        }
      } catch (error) {
        console.error('Error fetching loan data:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    if (isFocused) {
      fetchLoanData();
      refetch1(); // Fetch loan data when the page is focused
    }
  }, [isFocused]);

  if (loading) {
    return (
      <SafeAreaView className="h-full bg-primary">
        <View className="h-full items-center justify-center">
          <ActivityIndicator size="large" color="#76CE96" />
          <Text className="text-lg font-psemibold text-gray-700 mt-4">
            Loading loan Data...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full px-5 bg-primary">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Text className="font-psemibold mt-6 text-3xl text-center">
          Student Loan Repayment Over Time
        </Text>
        <TouchableOpacity
          onPress={() => {
            router.push('/(profileSettings)/loan-info');
          }}
          className="items-center justify-center flex-row rounded-2xl p-3 mt-3"
        >
          <View className="items-center justify-center">
            <View className="justify-center items-center h-[60px]">
              <Text className="text-gray-500 font-pregular min-h-[10%] text-md text-center">
                Student Loan {"\n"} Initial Balance
              </Text>
            </View>
            <Text className="text-secondary font-psemibold pt-3 text-2xl text-center">
              {'£' + loanData1.loanBalance || '£ 0'}
            </Text>
          </View>
          <View className="border-r-2 border-l-2 justify-center items-center p-1 m-1 border-secondary-50">
            <View className="justify-center items-center h-[60px]">
              <Text className="text-gray-500 min-h-[10%] font-pregular text-md text-center">
                Student Loan {"\n"} Plan
              </Text>
            </View>
            <Text className="text-secondary font-psemibold pt-3 text-2xl text-center">
              {loanData1.loanPlan}
            </Text>
          </View>
          <View className="items-center justify-center">
            <View className="justify-center items-center h-[60px]">
              <Text className="text-gray-500 min-h-[10%] font-pregular text-md text-center">
                Expected{"\n"} Annual Salary {"\n"} after Graduation
              </Text>
            </View>
            <Text className="text-secondary font-psemibold pt-3 text-2xl text-center">
              {'£' + loanData1.salary || '£ 0'}
            </Text>
          </View>
        </TouchableOpacity>
        <View className="w-full items-center justify-between">
          <Text className="text-gray-500 font-pregular text-lg mt-1 text-center">
            Loan Balance Over Time:
          </Text>
          <View className="flex-shrink border-2 border-secondary-50 rounded-xl mt-1">
            <TouchableWithoutFeedback>
              <LineChart
                data={{
                  labels: data
                    .filter((d) => isFinite(d.balance))
                    .map((d) => d.year.toString())
                    .filter((year) => parseInt(year) % 5 === 0),
                  legend: ["Loan Balance on Year X"],
                  datasets: [
                    {
                      data: data.map((d) => (isFinite(d.balance) ? d.balance : 0)),
                    },
                  ],
                }}
                width={Dimensions.get('window').width - 40}
                height={220}
                yAxisLabel="£"
                chartConfig={{
                  backgroundGradientFrom: "#FFFAFA",
                  backgroundGradientTo: "#FFFAFA",
                  color: (opacity = 1) => `rgba(118, 206, 150, ${opacity})`,
                  decimalPlaces: 0,
                }}
                style={{ marginVertical: 2, borderRadius: 16 }}
                onDataPointClick={(data) => {
                  const year = data.index; // Assuming labels are every 5 years
                  const balance = data.value;
                  setSelectedPoint({ year, balance });
                }}
              />
            </TouchableWithoutFeedback>
          </View>
          {Platform.OS === 'android' ? (
            <Text className="text-gray-500 my-5 font-pregular text-xl text-center p-5">
              Expected monthly repayment after graduation:{" "}
              <Text>
                {"\n"}{"\n"}
              </Text>
              <Text className="text-secondary font-psemibold text-4xl">
                {(() => {
                  const plans: Record<string, { threshold: number; rate: number; writeOff: number; interest: number }> = {
                    "1": { threshold: 26065, rate: 0.09, writeOff: 25, interest: 0.043 },
                    "2": { threshold: 28470, rate: 0.09, writeOff: 30, interest: 0.043 },
                    "3": { threshold: 21000, rate: 0.06, writeOff: 30, interest: 0.073 },
                    "4": { threshold: 32745, rate: 0.09, writeOff: 30, interest: 0.043 },
                    "5": { threshold: 25000, rate: 0.09, writeOff: 40, interest: 0.043 },
                  };

                  const planDetails = plans[loanData1.loanPlan];
                  if (!planDetails) return "N/A"; // Handle invalid loan plans

                  const { threshold, rate } = planDetails;
                  const monthlyRepayment = Math.max((loanData1.salary - threshold) * rate, 0) / 12;

                  return `£${monthlyRepayment.toFixed(2)}`;
                })()}
              </Text>
            </Text>
          ) : (
            <View className="w-full items-center justify-center mt-4">
              {selectedPoint && (
                <>
                  <Text className="text-gray-500 font-pregular text-xl text-center">
                    Selected Year: {selectedPoint.year}
                  </Text>
                  <Text className="text-secondary font-psemibold text-2xl text-center">
                    Balance: £{selectedPoint.balance.toFixed(2)}
                  </Text>
                </>
              )}
              <Text className="text-gray-500 my-1 font-pregular text-xl text-center">
                Expected monthly repayment after graduation:{" "}
                <Text >
                  {"\n"}
                </Text>
                <Text className="text-secondary font-psemibold text-3xl">
                  {(() => {
                    const plans: Record<string, { threshold: number; rate: number; writeOff: number; interest: number }> = {
                      "1": { threshold: 26065, rate: 0.09, writeOff: 25, interest: 0.043 },
                      "2": { threshold: 28470, rate: 0.09, writeOff: 30, interest: 0.043 },
                      "3": { threshold: 21000, rate: 0.06, writeOff: 30, interest: 0.073 },
                      "4": { threshold: 32745, rate: 0.09, writeOff: 30, interest: 0.043 },
                      "5": { threshold: 25000, rate: 0.09, writeOff: 40, interest: 0.043 },
                    };

                    const planDetails = plans[loanData1.loanPlan];
                    if (!planDetails) return "N/A"; // Handle invalid loan plans

                    const { threshold, rate } = planDetails;
                    const monthlyRepayment = Math.max((loanData1.salary - threshold) * rate, 0) / 12;

                    return `£${monthlyRepayment.toFixed(2)}`;
                  })()}
                </Text>
              </Text>
            </View>
          )}
        </View>
        <View className="w-full items-center justify-center mt-1">
          <Text
          className="text-gray-500 font-pregular text-lg text-center">
            For advanced customization of the inputs, we recommend using this external tool 
          </Text>
        <Text
          className="text-secondary  text-center text-lg"
          onPress={() => Linking.openURL('https://www.student-loan-calculator.co.uk/')}
        >
          CLICK HERE
        </Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StudentLoanChart;