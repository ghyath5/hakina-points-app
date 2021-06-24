import React from 'react'
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import {
    AdMobRewarded,
} from 'expo-ads-admob';
import theme from '../theme';
import { Feather } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
export default function Adreward({ done, watched, loaded, btnText, adUnitID, name }) {
    const [loadingRewarded, setLoadingRewardedAd] = React.useState(false)
    let isFocused = useIsFocused()
    React.useEffect(() => {
        const bootstrapAsync = async () => {
            await AdMobRewarded.setAdUnitID(adUnitID);
            AdMobRewarded.addEventListener("rewardedVideoUserDidEarnReward", () => watched && watched(name));
            AdMobRewarded.addEventListener("rewardedVideoDidLoad", () => loaded && loaded());
            AdMobRewarded.addEventListener("rewardedVideoDidFailToLoad", () => {
                Alert.alert("", "Failed to load Ad. Try again later")
            });
            AdMobRewarded.addEventListener("rewardedVideoDidFailToPresent", () => {
                Alert.alert("", "Failed to load Ad. Try again later")
            });
        }
        bootstrapAsync()
        return () => {
            AdMobRewarded.removeAllListeners()
        }
    }, [isFocused])
    const showAd = () => {
        setLoadingRewardedAd(true)
        AdMobRewarded.requestAdAsync({ servePersonalizedAds: true }).then(() => {
            AdMobRewarded.showAdAsync();
        }).catch(() => { }).finally(() => {
            setLoadingRewardedAd(false)
            done && done()
        });
    }
    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                backgroundColor: '#fff',
                padding: 10,
                paddingHorizontal: '10%',
                borderRadius: 50,
            }}
            onPress={() => {
                if (loadingRewarded) return;
                showAd()
            }}
        >
            {loadingRewarded ? <ActivityIndicator animating={true} size={20} color={theme.primary} /> :
                <>
                    <Text style={{ paddingHorizontal: 5 }}>{btnText || 'Watch'}</Text>
                    <Feather name="youtube" size={24} color={theme.primary} />
                </>
            }


        </TouchableOpacity>
    )
}