import { View, Text, TouchableOpacity, Image, Button, Platform} from 'react-native'
import React, { useRef, useState } from 'react'
import { icons, images } from '@/constants'
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera'
import { SafeAreaView } from 'react-native-safe-area-context'
import PhotoPreview from '@/components/PhotoPreview'

const scanReceipts = () => {

  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null >(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) { //could avoid platform
    // Camera permissions are not granted yet.
    return (
      <SafeAreaView className='h-full'>
      <View className='items-center h-full justify-center'>
        <Text className='text-black text-xl text-center font-psemibold'>We need your permission to use the camera</Text>
        <TouchableOpacity className='px-5 py-3 mt-5 bg-secondary rounded-xl' onPress={requestPermission}><Text className='text-primary text-lg font-pmedium'>Grant Permision</Text></TouchableOpacity>
      </View>
      </SafeAreaView>
    );
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const options = { quality: 1, base64: true, exif: false ,};
      const takenPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(takenPhoto);
      console.log("yes")
    }
  };

  const handleRetakePhoto = () => {
    setPhoto(null);
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  if (photo) return <PhotoPreview photo={photo} handleRetakePhoto={handleRetakePhoto} />;
  return (
    <SafeAreaView className='h-full items-center bg-primary'>
      <Text className='font-psemibold mt-6 text-3xl'>OCR Receipt Scanning</Text>
        <View className='gap-5 h-[80%] w-fulljustify-between items-center'>
          <View className='border-[3px] border-secondary mt-3 w-[300px] h-[430px]'>
            <CameraView  className='w-full h-full flex-1' facing={facing} ref={cameraRef}>
              <View className='w-full h-full items-center justify-end '>
              <View className='border-2 border-secondary border-dashed w-[50%] h-[80%] '></View>
                <View className='w-[100%] items-start'>
                <TouchableOpacity className='p-3' onPress={toggleCameraFacing}>
                  <Text className='text-xl font-pmedium'>Flip</Text>
                </TouchableOpacity>
                </View>
              </View>
            </CameraView>
          </View>
          <View className='w-[85%] flex-grow justify-center'>
            <TouchableOpacity onPress={handleTakePhoto} activeOpacity={0.7} className='shadow-md bg-secondary justify-center items-center rounded-xl min-w-[100%] min-h-[10%]'>
              <Text className='text-primary text-xl font-pmedium'>Scan</Text>
            </TouchableOpacity>
            
          </View>
        </View>
    </SafeAreaView>
  )
}

export default scanReceipts