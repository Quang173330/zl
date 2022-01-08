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

const Tab = createBottomTabNavigator();

export default function MainScreen() {
    return (
        <Tab.Navigator initialRouteName="MessageScreen">
            <Tab.Screen name="Message" component={MessageScreen} ></Tab.Screen>
            <Tab.Screen name="Phone" component={PhoneScreen} ></Tab.Screen>
        </Tab.Navigator>
    );
}