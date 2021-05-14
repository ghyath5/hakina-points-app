import React from 'react';
import {
    ActivityIndicator,
    View,
    Linking,
    Alert,
    BackHandler
} from 'react-native';
import { setTokens } from '../redux/clientSlice'
import { useSelector, useDispatch } from 'react-redux'
import { setCheck } from '../redux/globalSlice'
import { getNewToken } from '../apollo'

import Constants from 'expo-constants';
export default function AppLoading(props) {
    const refreshToken = useSelector((state) => state?.client?.refreshToken)
    const dispatch = useDispatch()
    if (Constants.nativeAppVersion != '4.1.0') {
        Alert.alert('تنبيه', "قم بتحديث التطبيق من المتجر", [
            {
                text: 'تحديث',
                onPress: () => Linking.openURL("market://details?id=com.superdar.hakina_coins")
            },
            {
                text: 'خروج',
                onPress: () => {
                    BackHandler.exitApp()
                }
            }
        ])
        return <View></View>
    }
    React.useEffect(() => {
        dispatch(setCheck(true))
        if (!refreshToken) {
            return props.navigation.navigate('Login');
        }
        getNewToken().then((data) => {
            if (!data) {
                // dispatch(setTokens({}))
                // return props.navigation.navigate('Login');
                return false;
            }
            dispatch(setTokens(data))
            props.navigation.navigate('Main');
        }).catch((e) => {
            for (let err of e.graphQLErrors) {
                if (err?.message?.includes("Error")) {
                    dispatch(setTokens({}))
                    return props.navigation.navigate('Login');
                }
            }
        })

        // props.navigation.navigate(accessToken ? 'Home' : 'Login');

    }, [])
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator animating={true} size={60} color={'blue'} />
        </View>
    );
}

