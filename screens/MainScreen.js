import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MessageScreen from './MessageScreen';
import LogInScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import PhoneScreen from './PhoneScreen';
import DiaryScreen from './DiaryScreen';
import PostDiaryScreen from './PostDiaryScreen';

const Tab = createBottomTabNavigator();

export default function MainScreen() {
    return (
        <Tab.Navigator initialRouteName="MessageScreen">
            <Tab.Screen name="Message" component={PhoneScreen} ></Tab.Screen>
            <Tab.Screen name="Phone" component={HomeScreen} ></Tab.Screen>
            <Tab.Screen name="Post" component={PostDiaryScreen} ></Tab.Screen>
            <Tab.Screen name="Nhật Ký" component={DiaryScreen} ></Tab.Screen>
        </Tab.Navigator>
    );
}