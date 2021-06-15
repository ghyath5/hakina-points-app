import { useQuery } from '@apollo/react-hooks'
import React, { useMemo } from 'react'
import { StyleSheet, FlatList, View, ActivityIndicator } from 'react-native'
import Client from '../../components/Client'
import { StatusBar } from 'expo-status-bar'
import { PREVIOUS_CLIENTS } from '../../gql'
import {
    AdMobBanner, AdMobInterstitial,
} from 'expo-ads-admob';
import { mainInterstital, bannerRecId } from '../../Admob';
export default function Search() {

    React.useEffect(() => {
        const bootstrapAsync = async () => {
            await AdMobInterstitial.setAdUnitID(mainInterstital);
            await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
            await AdMobInterstitial.showAdAsync();
        }
        bootstrapAsync()
    }, [])
    const displayAd = async () => {
        await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
        await AdMobInterstitial.showAdAsync();
    }
    const { data, loading, error } = useQuery(PREVIOUS_CLIENTS, {})
    let clients = data?.get_previous_clients?.clients
    const renderItem = (props) => <Client {...props} onClick={() => {
        if (Math.random() >= 0.4 && Math.random() >= 0.4) {
            displayAd()
        }
    }} />
    const memoRenderItem = useMemo(() => renderItem, [])
    return (
        <View style={{ paddingTop: 10, height: '100%' }}>
            <StatusBar style={'dark'} />
            {loading &&
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator animating={loading} size={55} color={'blue'} />
                </View>
            }
            <AdMobBanner
                bannerSize="smartBannerPortrait"
                adUnitID={bannerRecId}
                servePersonalizedAds />
            <FlatList
                data={clients}
                renderItem={memoRenderItem}
                keyExtractor={(item) => item.tel_id}
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({})
