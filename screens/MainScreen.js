import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MessageScreen from './MessageScreen';
import HomeScreen from './HomeScreen';
import PhoneScreen from './PhoneScreen';
import DiaryScreen from './DiaryScreen';
import MyProfileScreen from './MyProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainScreen() {
    return (
        <Tab.Navigator initialRouteName="MessageScreen">
            <Tab.Screen name="Messages" component={MessageScreen} ></Tab.Screen>
            <Tab.Screen name="Phone" component={HomeScreen} ></Tab.Screen>
            <Tab.Screen name="Nhật Ký" component={DiaryScreen} ></Tab.Screen>
            <Tab.Screen name="Profile" component={MyProfileScreen} ></Tab.Screen>
        </Tab.Navigator>
    );
}