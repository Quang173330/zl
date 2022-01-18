import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MessageScreen from './MessageScreen';
import HomeScreen from './HomeScreen';
import PhoneScreen from './PhoneScreen';
import DiaryScreen from './DiaryScreen';
import MyProfileScreen from './MyProfileScreen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TestScreen from './TestScreen';
import ProfileScreen from './ProfileScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Entypo } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainScreen() {
    return (
        <Tab.Navigator 
            initialRouteName="MessageScreen" 
            // screenOptions={{
            //     headerShown: false,
            // }}
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Tin nhắn') {
                        iconName = focused
                            ? 'chatbubbles-outline'
                            : 'chatbubbles-outline';
                    } else if (route.name === 'Danh bạ') {
                        iconName = focused ? 'call-outline' : 'call-outline';
                    } else if (route.name === 'Nhật Ký') {
                        iconName = focused ? 'newspaper-outline' : 'newspaper-outline';
                    } else if (route.name === 'Cá nhân') {
                        iconName = focused ? 'person-outline' : 'person-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#038cfc',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Tin nhắn" component={MessageScreen} ></Tab.Screen>
            <Tab.Screen name="Danh bạ" component={PhoneScreen} ></Tab.Screen>
            <Tab.Screen name="Nhật Ký" component={DiaryScreen} ></Tab.Screen>
            <Tab.Screen name="Cá nhân" component={ProfileScreen} ></Tab.Screen>
        </Tab.Navigator>
    );
}