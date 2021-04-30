import React from 'react'
import { StyleSheet, Platform } from 'react-native'

import SettingsScreen from '../screens/Tabs/Settings'
import StoreScreen from '../screens/Tabs/Store'
import HomeScreen from '../screens/Tabs/Home'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Tab = createBottomTabNavigator();

export default function tabs() {
    return (
        <Tab.Navigator
            initialRouteName={'الرئيسية'}
            backBehavior={'initialRoute'}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    switch (route.name) {
                        case 'المتجر':
                            iconName = 'logo-google-playstore'
                            break;
                        case 'الرئيسية':
                            iconName = 'home-outline'
                            break;
                        case 'الحساب':
                            iconName = 'settings-outline'
                            break;
                    }

                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen name="الحساب" component={SettingsScreen} />
            {Platform.OS == 'android' && <Tab.Screen name="المتجر" component={StoreScreen} />}
            <Tab.Screen name="الرئيسية" component={HomeScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({})
