import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import StockScreen from './screens/stockTab/StockScreen';
import SettingsScreen from './screens/settingTab/SettingsScreen';
import HomeScreen from './screens/homeTab/HomeScreen';
import WeiStockScreen from './screens/settingTab/WeiStockScreen';
import RecordScreen from './screens/settingTab/RecordScreen';

const AppStack = createNativeStackNavigator();
const HomeTab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();
const StockStack = createNativeStackNavigator();

function StockStackScreen() {
  return (
    <StockStack.Navigator>
      <StockStack.Screen name="StockScreen" component={StockScreen} />
    </StockStack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="SettingsScreen" component={SettingsScreen} />
      <SettingsStack.Screen name="WeiStock" component={WeiStockScreen} />
      <SettingsStack.Screen name="Record" component={RecordScreen} />
    </SettingsStack.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        // options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
}

function Tabs() {
  return (
    <HomeTab.Navigator
      initialRouteName="StockTab"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          if (route.name === 'StockTab') {
          } else if (route.name === 'HomeTab') {
          } else if (route.name === 'SettingsTab') {
          }
        },
      })}>
      <HomeTab.Screen
        name="StockTab"
        component={StockStackScreen}
        options={{tabBarLabel: '即時報價', headerShown: false}}
      />
      <HomeTab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{tabBarLabel: '帳務庫存', headerShown: false}}
      />
      <HomeTab.Screen
        name="SettingsTab"
        component={SettingsStackScreen}
        options={{tabBarLabel: '設定', headerShown: false}}
      />
    </HomeTab.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <AppStack.Navigator>
        <AppStack.Screen
          name="Tabs"
          component={Tabs}
          options={{headerShown: false}}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
