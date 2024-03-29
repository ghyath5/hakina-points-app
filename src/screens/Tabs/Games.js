import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, BackHandler, Alert, ActivityIndicator, Dimensions, Animated, LogBox } from 'react-native'
import { useQuery } from '@apollo/react-hooks'
import { useSelector, } from 'react-redux'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Theme from '../../theme'
import LoadGame, { games } from '../../games'
import GameShape from '../../components/Game'
import { getNewToken } from './../../apollo'
import { ME } from './../../gql'
import { ioSocket } from '../../socket'
import {
    AdMobBanner, AdMobInterstitial,
} from 'expo-ads-admob';
import * as Analytics from 'expo-firebase-analytics';
import { bannerRecId, mainInterstital } from '../../Admob';
LogBox.ignoreLogs(["Setting a timer"]);

const { height } = Dimensions.get('screen')
export default function Games({ navigation }) {
    const [gamePath, setGamePath] = useState(null)
    const [partner, setPartner] = useState({})
    const [socket, setSocket] = useState(null)
    const LoadedGame = LoadGame(gamePath)
    const toastMsgSclae = new Animated.Value(1)
    const tel_id = useSelector((state) => state.client.tel_id)
    const showStatusBar = true //Boolean(!gamePath)
    React.useEffect(() => {
        let interval
        navigation.addListener('blur', () => {
            clearInterval(interval)
        });
        const unsubscribe = navigation.addListener('focus', () => {
            getNewToken().then(() => {
                let socket = ioSocket({ namespace: '/' })
                setSocket(socket)
            })
            interval = setInterval(() => {
                getNewToken()
            }, 1000 * 60 * 4)
        });
        return unsubscribe;
    }, [navigation]);
    useEffect(() => {
        socket?.on('connect', (data) => { });
        socket?.on('connected with', ({ client }) => {
            setPartner(client)
        });
        return () => {
            socket?.disconnect()
        }
    }, [socket])
    useEffect(() => {
        const backAction = () => {
            if (!gamePath) return false;
            Alert.alert("", "You want to exit game ?", [
                {
                    text: 'Exit',
                    onPress: () => {
                        setGamePath(null)
                        displayAd()
                    }
                },
                {
                    text: "Stay",
                    onPress: () => navigation.setOptions({ tabBarVisible: false })
                }
            ])

            navigation.setOptions({ tabBarVisible: true });
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => {
            // navigation.setOptions({ tabBarVisible: true });
            backHandler.remove()
        }
    }, [gamePath])
    const { data, loading, error } = useQuery(ME, {
        variables: {
            tel_id
        }
    })
    let client = data?.clients_by_pk
    useEffect(() => {
        runAnalytic = async () => {
            await Analytics.setUserId(tel_id || 'not-specified-yet');
            await Analytics.setUserProperties({
                client_name: client?.first_name || 'unknown client name'
            });
        }

        if (client) {
            runAnalytic()
        }
    }, [client])
    const enterGame = (path) => {
        if (!partner) {
            socket.emit('get connected client')
            return animateToast();
        }
        setGamePath(path)
        navigation.setOptions({ tabBarVisible: false });
    }
    React.useEffect(() => {
        const bootstrapAsync = async () => {
            await AdMobInterstitial.setAdUnitID(mainInterstital);
        }
        bootstrapAsync()
    }, [])
    const displayAd = async () => {
        await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
        await AdMobInterstitial.showAdAsync();
    }
    const animateToast = () => {
        Animated.spring(toastMsgSclae, {
            toValue: 1.08,
            useNativeDriver: false,
            speed: 150
        }).start(() => {
            Animated.spring(toastMsgSclae, {
                toValue: 1,
                useNativeDriver: false,
                stiffness: 400
            }).start()
        })
    }
    if (partner && !partner.first_name) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator animating={true} size={55} color={'blue'} />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            {
                showStatusBar &&
                <View style={styles.topBar}>
                    <View style={styles.pointsContainer}>
                        <FontAwesome5 name={'coins'} color={'orange'} />
                        <Text style={styles.points}>
                            {client?.points}
                        </Text>
                    </View>
                    <Text style={styles.title}>Hakina Games</Text>
                </View>
            }
            <AdMobBanner
                bannerSize="smartBannerPortrait"
                adUnitID={bannerRecId} // Test ID, Replace with your-admob-unit-id
                servePersonalizedAds />
            {
                showStatusBar &&
                <Animated.View style={{
                    transform: [
                        {
                            scaleX: toastMsgSclae
                        },
                        {
                            scaleY: toastMsgSclae
                        }
                    ],
                    backgroundColor: partner ? Theme.primary : 'tomato', padding: 5, borderRadius: 15, top: height / 55, justifyContent: 'center', alignItems: 'center', width: '90%', marginBottom: height / 35
                }}>
                    {!partner &&
                        <Text style={{ color: 'orange', ...styles.toastMsg }}>You have to be in a conversation in Hakina bot to be able to play these games</Text>
                    }
                    {partner && partner.first_name &&
                        <Text style={{ ...styles.toastMsg }}>You are playing with {partner.first_name}</Text>
                    }
                </Animated.View>
            }
            {gamePath ?
                <View style={{ flex: 1, width: '100%' }}>
                    <LoadedGame partner={partner} me={client} navigation={navigation} />

                </View>
                :
                <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'flex-start', flexDirection: 'row', width: '100%' }}>
                    {
                        games.map((game, i) => {
                            return <GameShape key={i} name={game.name} onClick={() => {
                                enterGame(game.path)
                            }} />
                        })
                    }
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#eee',
        flex: 1,
        alignItems: 'center',
    },
    topBar: {
        backgroundColor: 'white',
        width: '100%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    pointsContainer: {
        backgroundColor: '#eee',
        borderRadius: 50,
        width: '20%',
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    points: {
        color: 'black',
    },
    title: {
        fontWeight: 'bold',
        color: Theme.primary
    },
    toastMsg: {
        textAlign: 'center',
        color: 'white'
    }
})