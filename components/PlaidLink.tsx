import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { PlaidLink, usePlaidEmitter } from 'react-native-plaid-link-sdk';
import { plaidService } from '../lib/plaid/plaidService';
import { databases } from '../lib/appwrite';
import { ID } from 'react-native-appwrite';

interface PlaidLinkProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const PlaidLinkComponent: React.FC<PlaidLinkProps> = ({ onSuccess, onError }) => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Subscribe to Plaid events
  usePlaidEmitter((event) => {
    console.log('Plaid Event:', event);
  });

  useEffect(() => {
    const initializePlaid = async () => {
      try {
        const token = await plaidService.createLinkToken();
        setLinkToken(token);
      } catch (error) {
        console.error('Error initializing Plaid:', error);
        onError?.(error as Error);
      }
    };

    initializePlaid();
  }, []);

  const handleSuccess = async (publicToken: string, metadata: any) => {
    setLoading(true);
    try {
      // Exchange the public token for an access token
      await plaidService.exchangePublicToken(publicToken);

      // Get transactions for the last 30 days
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const transactions = await plaidService.getTransactions(startDate, endDate);

      // Store transactions in Appwrite
      for (const transaction of transactions) {
        await databases.createDocument('main', 'transactions', ID.unique(), {
          ...transaction,
          // You'll need to set budgetData based on your categorization logic
          budgetData: null,
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error processing Plaid success:', error);
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleExit = (exitError: any) => {
    if (exitError) {
      console.error('Plaid Link exit error:', exitError);
      onError?.(exitError);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-gray-600">Processing your bank connection...</Text>
      </View>
    );
  }

  return (
    <View className="p-4">
      {linkToken && (
        <PlaidLink
          tokenConfig={{
            token: linkToken,
            noLoadingState: false,
          }}
          onSuccess={handleSuccess}
          onExit={handleExit}
        >
          <View className="rounded-lg bg-blue-500 p-4">
            <Text className="text-center text-white font-semibold">
              Connect Your Bank
            </Text>
          </View>
        </PlaidLink>
      )}
    </View>
  );
}; 