import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert, Platform } from 'react-native'
import { Feather } from '@expo/vector-icons';
import {
    AdMobBanner,
    AdMobRewarded,
} from 'expo-ads-admob';
import { useSelector, useDispatch } from 'react-redux'
import { useApolloClient } from '@apollo/client'
import { setTime } from '../../redux/clientSlice'
import sign from '../../sign'
import Timer from '../../components/Timer'
import { REWARDED, SET_DEVICE_INFO } from '../../gql'
import * as Device from 'expo-device';
import { bannerRecId, bannerRecIdIOS, rewardedVidId, rewardedVidIdIOS } from '../../Admob'
import Adreward from '../../components/Adreward'
import { useIsFocused } from '@react-navigation/native';
const TAB_NAME = 'HOME'
export default function Home() {
    const android_info = {
        isDevice: Device.isDevice,
        brand: Device.brand,
        manufacturer: Device.manufacturer,
        modelName: Device.modelName,
        designName: Device.designName,
        productName: Device.productName,
        deviceYearClass: Device.deviceYearClass,
        totalMemory: Device.totalMemory,
        supportedCpuArchitectures: Device.supportedCpuArchitectures,
        osName: Device.osName,
        osVersion: Device.osVersion,
        osBuildId: Device.osBuildId,
        osInternalBuildId: Device.osInternalBuildId,
        osBuildFingerprint: Device.osBuildFingerprint,
        platformApiLevel: Device.platformApiLevel,
        deviceName: Device.deviceName,
    }
    const tel_id = useSelector((state) => state.client.tel_id)
    const time = useSelector((state) => state.client.time) || new Date()
    let timeToEnter = ((new Date(time).getTime() / 1000) - (new Date().getTime() / 1000))
    const [reward, setReward] = React.useState({
        canReward: Boolean(timeToEnter <= 0),
        loading: false
    })
    const dispatch = useDispatch()
    const apolloClient = useApolloClient()
    React.useEffect(() => {
        const bootstrapAsync = async () => {
            await AdMobRewarded.setAdUnitID(Platform.OS === 'ios' ? rewardedVidIdIOS : rewardedVidId);
        }
        bootstrapAsync()
    }, [])
    let isFocused = useIsFocused()
    apolloClient.mutate({
        mutation: SET_DEVICE_INFO,
        variables: {
            pk_columns: {
                tel_id
            },
            _set: {
                android_info
            }
        }
    }).catch(() => { })

    const rewarded = () => {
        if (!isFocused) return;
        setReward({
            ...reward,
            loading: true
        })
        let token = sign({ target: 'REWARDED', tel_id })
        apolloClient.mutate({
            mutation: REWARDED,
            variables: {
                key: token
            }
        }).then(({ data }) => {
            if (data?.app_rewarded?.state) {
                dispatch(setTime(new Date().setMinutes(new Date().getMinutes() + 45)))
            }
            Alert.alert("", data?.app_rewarded?.message)
        }).catch(e => {
            Alert.alert("", "Error!")
        }).finally(() => {
            setReward({
                ...reward,
                loading: false
            })
        })
    }
    return (
        <View style={styles.container}>
            <ActivityIndicator style={{ flex: 1, position: 'absolute', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }} animating={reward.loading} size={70} color={'tomato'} />
            <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                <AdMobBanner
                    bannerSize="mediumRectangle"
                    adUnitID={Platform.OS == 'ios' ? bannerRecIdIOS : bannerRecId}
                    servePersonalizedAds // true or false
                    onDidFailToReceiveAdWithError={(e) => { }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {Boolean(timeToEnter <= 0) ?
                    isFocused && <Adreward
                        adUnitID={rewardedVidId}
                        btnText={'Collect Points'}
                        name={TAB_NAME}
                        watched={(actionName) => {
                            if (actionName != TAB_NAME) return
                            rewarded()
                        }} />

                    : <Timer timeToEnter={timeToEnter} timerDone={() => {
                        setReward({
                            loading: false,
                            canReward: true
                        })
                    }} />}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
