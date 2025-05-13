import React, { useState } from 'react';
import { CameraCapturedPicture } from 'expo-camera';
import { TouchableOpacity, Image, View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ukShopsCategorized from '../constants/uk_shops_categorized.json';
import { router } from 'expo-router';
//Make response turn into shop, amount, category and forward to add expense page with filled fields
const PhotoPreview = ({ photo, handleRetakePhoto }: { photo: CameraCapturedPicture; handleRetakePhoto: () => void; }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleReceiptOCR = async () => {
    setIsProcessing(true);
    try {
      console.log("=== JavaScript/Node.js UK receipt OCR ===");
  
      const receiptOcrEndpoint = 'https://ocr.asprise.com/api/v1/receipt';
  
      // Use FormData to send the image
      const formData = new FormData();
      formData.append('api_key', 'TEST'); // Use 'TEST' for testing purpose
      formData.append('recognizer', 'auto'); // can be 'US', 'CA', 'JP', 'SG' or 'auto'
      formData.append('ref_no', 'ocr_nodejs_123'); // optional caller provided ref code
      formData.append('file', {
        uri: photo.uri, // Use the URI of the captured photo
        type: 'image/jpeg', // Specify the image type
        name: 'receipt.jpg', // Provide a file name
      } as any);
  
      // Make the POST request
      const response = await fetch(receiptOcrEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const result = await response.json();
      console.log('OCR Result:', result);
    if (!result.success) {
      Alert.alert('Error', 'No receipt detected. Please try again.');
      return; // Exit the function early
    }

    // Extract merchant_name and total
    const receipt = result.receipts?.[0]; // Get the first receipt
    const merchantName = receipt?.merchant_name || 'Unknown Merchant';
    const total = receipt?.total || 0;
    const date = receipt?.date || new Date().toISOString(); // Use current date if not found

    console.log('Merchant Name:', merchantName);
    console.log('Total:', total);
    console.log('Date:', date);

    // Match merchant_name with categories in uk_shops_categorized.json
    let expenseType = 'Uncategorized'; // Default category
    const merchantWords = merchantName.toLowerCase().split(/\s+/); // Split merchant name into words

    for (const [category, shops] of Object.entries(ukShopsCategorized)) {
      for (const shop of shops) {
        const shopWords = shop.toLowerCase().split(/\s+/); // Split shop name into words
        if (merchantWords.some((merchantWord) => shopWords.includes(merchantWord))) {
          expenseType = category; // Assign the matched category
          break;
        }
      }
      if (expenseType !== 'Uncategorized') break; // Stop searching if a match is found
    }

    console.log('Expense Type:', expenseType);

    // Navigate to the "Enter Expense" page with pre-filled fields
    router.push({
      pathname: '/(budget)/enter-expense',
      params: {
        shopName1: merchantName,
        amount1: total.toFixed(2), // Format total to 2 decimal places
        category1: expenseType,
        date1: date,  // Pass the matched category
      },
    });
  } catch (error) {
    console.error('Error processing OCR:', error);
    Alert.alert('Error', 'Failed to process the image.');
  } finally {
    setIsProcessing(false);
    handleRetakePhoto();
  }
};
 
  return (
    <SafeAreaView className='h-full items-center bg-primary'>
      <Text className='font-psemibold mt-6 text-3xl'>OCR Receipt Scanning</Text>
      <View className='gap-5 h-[80%] w-full justify-between items-center'>
        <View className='border-[3px] border-secondary mt-3 w-[300px] h-[430px]'>
          <Image
            className='w-full h-full'
            source={{ uri: 'data:image/jpg;base64,' + photo.base64 }}
          />
        </View>
        <View className='w-[85%]'>
          <TouchableOpacity onPress={handleRetakePhoto} activeOpacity={0.7} className='shadow-md bg-secondary justify-center items-center rounded-xl min-w-[100%] min-h-[10%]'>
            <Text className='text-primary text-xl font-pmedium'>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReceiptOCR} activeOpacity={0.7} className='shadow-md mt-10 bg-secondary justify-center items-center rounded-xl min-w-[100%] min-h-[10%]'>
            <Text className='text-primary text-xl font-pmedium'>{isProcessing ? 'Processing...' : 'Add to Budget'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PhotoPreview;