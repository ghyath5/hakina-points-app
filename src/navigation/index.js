import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AppLoadingScreen from '../screens/AppLoading'
import MainScreen from '../screens/Main'
import LoginScreen from '../screens/Login'
import { useSelector } from 'react-redux'
const Stack = createStackNavigator();

const AppNavigator = () => {
    const checked = useSelector((state) => state?.global?.isChecked)
    const refreshToken = useSelector((state) => state?.client?.refreshToken)
    return (
        // <SafeAreaProvider>
        <NavigationContainer>
            <Stack.Navigator headerMode={false}>
                {!checked && <Stack.Screen name="Startup" component={AppLoadingScreen} />}
                {!refreshToken && <Stack.Screen name="Login" component={LoginScreen} />}
                {refreshToken && <Stack.Screen name="Main" component={MainScreen} />}
            </Stack.Navigator>
        </NavigationContainer>
        // </SafeAreaProvider>
    )
}
export default AppNavigator