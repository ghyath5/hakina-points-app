import React from 'react';
import {
    ActivityIndicator,
    View,
} from 'react-native';
import { setTokens } from '../redux/clientSlice'
import { useSelector, useDispatch } from 'react-redux'
import { setCheck } from '../redux/globalSlice'
import { getNewToken } from '../apollo'
export default function AppLoading(props) {
    const refreshToken = useSelector((state) => state?.client?.refreshToken)
    const dispatch = useDispatch()
    React.useEffect(() => {
        dispatch(setCheck(true))
        if (!refreshToken) {
            return props.navigation.navigate('Login');
        }
        getNewToken().then((data) => {
            if (!data) {
                dispatch(setTokens({}))
                return props.navigation.navigate('Login');
            }
            dispatch(setTokens(data))
            props.navigation.navigate('Main');
        })

        // props.navigation.navigate(accessToken ? 'Home' : 'Login');

    }, [])
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator animating={true} size={60} color={'blue'} />
        </View>
    );
}

