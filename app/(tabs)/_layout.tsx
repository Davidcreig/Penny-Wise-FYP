import { View, Text, Image, Platform, Dimensions } from 'react-native'
import React from 'react'
import {Tabs, Redirect} from 'expo-router';
import {icons} from '../../constants';
import { StatusBar } from 'expo-status-bar';

const {height} = Dimensions.get('window');

const TabIcon = ({icon, color, name, focused}:{focused : boolean; icon : any ; color : any, name : string}) =>{
    return(
      <View
      className={`mt-7 items-center w-40 gap-2 `}
      >
        <Image
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className={'w-8 h-8'}
        />
        <Text className={"${focused ? 'font-psemibold' : 'font-pregular'} text-xs"} style={{color: color}}>
          {name}
        </Text>
      </View>
    )
  }
const TabsLayout = () => {
  return (
    <>
    <Tabs
    screenOptions={{
      tabBarShowLabel: false,
      tabBarActiveTintColor: '#76CE96',
      tabBarInactiveTintColor: '#263238',
      tabBarHideOnKeyboard: true,
      headerPressOpacity:0.2,
      tabBarStyle:{
        borderRadius:25,
        borderCurve: 'continuous',
        position: 'absolute',
        bottom:17,
        marginHorizontal:10,
        backgroundColor:'#FFFAFA',
        height: 75,
        shadowOpacity:0.2,
        shadowColor:'Black',
        shadowRadius:7,
        shadowOffset:{width:0, height:10},
        
        
      
      }
    }}
    >
      <Tabs.Screen
      name='budget'
      options={{
        title: 'Budget',
        headerShown: false,
        tabBarIcon:({color, focused})=>(
          <TabIcon
          icon={icons.calculator}
          color={color}
          name='Budget'
          focused={focused}
          />
        )
      }}
      />
      <Tabs.Screen
      name='loan-prediction'
      options={{
        title: 'Loan-Prediction',
        headerShown: false,
        tabBarIcon:({color, focused})=>(
          <TabIcon
          icon={icons.graph}
          color={color}
          name='Loan Prediction'
          focused={focused}
          />
        )
      }}
      />
      <Tabs.Screen
      name='scan-receipts'
      options={{
        title: 'Scanreceipts',
        headerShown: false,
        tabBarIcon:({color, focused})=>(
          <TabIcon
          icon={icons.scan}
          color={color}
          name='Scan Receipts'
          focused={focused}
          />
        )
      }}
      />
      <Tabs.Screen
      name='profile'
      options={{
        title: 'Profile',
        headerShown: false,
        tabBarIcon:({color, focused})=>(
          <TabIcon
          icon={icons.profile}
          color={color}
          name='Profile'
          focused={focused}
          />
        )
      }}
      />
    </Tabs>
    <StatusBar backgroundColor='#FFFAFA' style='dark'/> 
    </>
  )
}

export default TabsLayout