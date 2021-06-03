import React from 'react'
import { StyleSheet, Platform } from 'react-native'

import SearchScreen from '../screens/Tabs/Search'
import GamesScreen from '../screens/Tabs/Games'
import SettingsScreen from '../screens/Tabs/Settings'
import StoreScreen from '../screens/Tabs/Store'
import HomeScreen from '../screens/Tabs/Home'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Analytics from 'expo-firebase-analytics';
const Tab = createBottomTabNavigator();
export default function tabs() {
    return (
        <Tab.Navigator
            initialRouteName={'Home'}
            backBehavior={'initialRoute'}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    switch (route.name) {
                        case 'Store':
                            iconName = 'logo-google-playstore'
                            break;
                        case 'Home':
                            iconName = 'home-outline'
                            break;
                        case 'Search':
                            iconName = 'search-outline'
                            break;
                        case 'Games':
                            iconName = 'game-controller-outline'
                            break;
                        case 'Account':
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
            <Tab.Screen
                listeners={{
                    tabPress: e => {
                        Analytics.setCurrentScreen('Account');
                    },
                }}
                name="Account" component={SettingsScreen} />
            {Platform.OS == 'android' && <Tab.Screen
                listeners={{
                    tabPress: e => {
                        Analytics.setCurrentScreen('Store');
                    },
                }}
                name="Store" component={StoreScreen} />}
            <Tab.Screen name="Games"
                listeners={{
                    tabPress: e => {
                        Analytics.setCurrentScreen('Games');
                    },
                }}
                component={GamesScreen} />
            {/* <Tab.Screen name="بحث" component={SearchScreen} /> */}
            <Tab.Screen name="Home"
                listeners={{
                    tabPress: e => {
                        Analytics.setCurrentScreen('Home');
                    },
                }}
                component={HomeScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({})
