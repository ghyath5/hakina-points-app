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
import Theme from '../../theme'
import sign from '../../sign'
import Timer from '../../components/Timer'
import { REWARDED, SET_DEVICE_INFO } from '../../gql'
import * as Device from 'expo-device';
import { bannerRecId, bannerRecIdIOS, rewardedVidId, rewardedVidIdIOS } from '../../Admob'
export default function Home() {
    const [loadingRewarded, setLoadingRewardedAd] = React.useState(false)
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
    React.useEffect(() => {
        // AdMobRewarded.addEventListener('rewardedVideoDidDismiss', () => rewarded())
        AdMobRewarded.addEventListener("rewardedVideoUserDidEarnReward", () => rewarded());
        AdMobRewarded.addEventListener("rewardedVideoDidLoad", () => { });
        AdMobRewarded.addEventListener("rewardedVideoDidFailToLoad", () => {
            Alert.alert("", "Failed to load Ad. Try again later")
        });
        AdMobRewarded.addEventListener("rewardedVideoDidFailToPresent", () => {
            Alert.alert("", "Failed to load Ad. Try again later")
        });
        return () => {
            AdMobRewarded.removeAllListeners()
        }
    }, [])
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
        // if (!reward) {
        //     Alert.alert("", "يجب عليك مشاهدة الفيديو بالكامل لتحصل على النقاط")
        // }
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
                dispatch(setTime(new Date().setMinutes(new Date().getMinutes() + 60)))
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
    const collectPoints = () => {
        setLoadingRewardedAd(true)
        AdMobRewarded.requestAdAsync({ servePersonalizedAds: true }).then(() => {
            AdMobRewarded.showAdAsync();
        }).catch(error => console.log(error)).finally(() => {
            setLoadingRewardedAd(false)
        });
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
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            width: '70%',
                            backgroundColor: '#fff',
                            padding: 10,
                            borderRadius: 50,
                        }}
                        onPress={() => {
                            if (!reward.loading) {
                                collectPoints()
                            }
                        }}
                    >
                        {loadingRewarded ? <ActivityIndicator animating={true} size={20} color={Theme.primary} /> :
                            <>
                                <Text style={{ paddingHorizontal: 5 }}>Collect Points</Text>
                                <Feather name="youtube" size={24} color={Theme.primary} />
                            </>
                        }

                    </TouchableOpacity>
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
