import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

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
  // Loan plans with different repayment thresholds, rates, and write-off durations
  const plans: Record<string, { threshold: number; rate: number; writeOff: number; interest: number }> = {
    "1": { threshold: 24990, rate: 0.09, writeOff: 25, interest: 0.03 },
    "2": { threshold: 27295, rate: 0.09, writeOff: 30, interest: 0.05 },
    "3": { threshold: 21000, rate: 0.06, writeOff: 30, interest: 0.06 },
    "4": { threshold: 27660, rate: 0.09, writeOff: 30, interest: 0.05 },
    "5": { threshold: 25000, rate: 0.09, writeOff: 40, interest: 0.03 },
  };

  const { threshold, rate, writeOff, interest } = plans[plan];

  let balance = initialDebt; // Initial debt balance
  let salary = income; // Starting salary
  const repayments: Repayment[] = []; // Array to store repayment data
  const salaryGrowth = 0.02; // Annual salary growth of 2%

  // Calculate repayment for each year
  for (let year = 1; year <= Math.min(years, writeOff); year++) {
    const annualRepayment = Math.max((salary - threshold) * rate, 0); // Repayment is percentage of salary above threshold
    balance = balance * (1 + interest) - annualRepayment; // Apply interest and subtract the repayment

    if (balance <= 0) break; // Stop if the loan is fully paid off

    repayments.push({ year, balance, annualRepayment });
    salary *= (1 + salaryGrowth); // Apply salary growth
  }

  return repayments;
};

// Student Loan Repayment Chart Component
const StudentLoanChart: React.FC<{
  income?: number;
  initialDebt?: number;
  plan?: string;
}> = ({ income = 30000, initialDebt = 50000, plan = "2" }) => {
  const [data, setData] = useState<Repayment[]>([]);

  useEffect(() => {
    // Calculate repayments whenever the component mounts or when inputs change
    setData(calculateRepayments(income, initialDebt, plan));
  }, [income, initialDebt, plan]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Loan Repayment Over Time</Text>
      <LineChart
        data={{
          labels: data.map(d => d.year.toString()), // Year labels
          datasets: [
            {
              data: data.map(d => d.balance), // Plot the balance over the years
            },
          ],
        }}
        width={Dimensions.get('window').width - 40} // Adjust chart width
        height={220}
        yAxisLabel="£" // Currency symbol
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Line color
          decimalPlaces: 0, // Round to nearest pound
        }}
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default StudentLoanChart;
