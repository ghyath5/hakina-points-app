import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';

import AppLoadingScreen from '../screens/AppLoading'
import MainScreen from '../screens/Main'
// import FindScreen from '../screens/Find'
import LoginScreen from '../screens/Login'
import { useSelector } from 'react-redux'
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
const Stack = createStackNavigator();

const prefix = Linking.createURL('/');
const AppNavigator = () => {
    const linking = {
        prefixes: [prefix],
    };
    const checked = useSelector((state) => state?.global?.isChecked)
    const refreshToken = useSelector((state) => state?.client?.refreshToken)
    return (
        <ApplicationProvider {...eva} theme={eva.light}>
            <NavigationContainer linking={linking}>
                <Stack.Navigator headerMode={false}>
                    {!checked && <Stack.Screen name="Startup" component={AppLoadingScreen} />}
                    {!refreshToken && <Stack.Screen name="Login" component={LoginScreen} />}
                    {refreshToken && (
                        <>
                            <Stack.Screen name="Main" component={MainScreen} />
                        </>
                    )
                    }
                </Stack.Navigator>
            </NavigationContainer>
        </ApplicationProvider>
    )
}
export default AppNavigator