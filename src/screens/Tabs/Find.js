import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, Animated, Keyboard, BackHandler, ActivityIndicator } from 'react-native'
import Adreward from '../../components/Adreward'
import { lockedVideoId } from '../../Admob'
import sign from '../../sign'
import { useSelector, useDispatch } from 'react-redux'
import { useApolloClient, } from '@apollo/react-hooks'
import { searcherClient } from '../../apollo'
import { GENERATE_SEARCH_TOKEN, CLIENTS } from '../../gql'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../theme'
import { setSearchToken } from '../../redux/clientSlice'
import SearchResults from '../../components/SearchResults'
import {
    AdMobBanner
} from 'expo-ads-admob';
import { bannerRecId } from '../../Admob';
import { useIsFocused } from '@react-navigation/native'
import { Input } from '@ui-kitten/components';
const { width, height, fontScale } = Dimensions.get('window')
const TAB_NAME = 'FIND'
export default function Find({ navigation }) {
    const [maleBoxScale] = useState(new Animated.Value(1))
    const [femaleBoxScale] = useState(new Animated.Value(1))
    const tel_id = useSelector((state) => state.client.tel_id)
    let lockedToken = sign({ target: 'SEARCHER_TOKEN', tel_id })
    const apolloClient = useApolloClient()
    const dispatch = useDispatch()
    const [locked, setLocked] = useState(true)
    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(false)
    const [gender, setGender] = useState('male')
    const [searchName, setSearchName] = useState('')
    const [searchClients, setSearchClients] = useState([])
    const [clients, setClients] = useState([])
    const nameInput = useRef(null)
    const isFocused = useIsFocused()
    const generateSearchToken = async () => {
        setPageLoading(true)
        let { data } = await apolloClient.mutate({
            mutation: GENERATE_SEARCH_TOKEN,
            variables: {
                key: lockedToken
            }
        })
        if (data?.app_generate_searcher_token?.accessToken) {
            setLocked(false)
            setSearchClients(data?.app_generate_searcher_token?.allowedClientsIds)
            dispatch(setSearchToken({
                searcherAccessToken: data?.app_generate_searcher_token?.accessToken
            }))
            setPageLoading(false)
        }
    }
    const isSelect = (sex) => {
        return gender == sex
    }
    React.useEffect(() => {
        if (isSelect('female')) {
            Animated.timing(femaleBoxScale, {
                toValue: 1.08,
                useNativeDriver: true,
                duration: 100
            }).start()
            Animated.timing(maleBoxScale, {
                toValue: 1,
                useNativeDriver: true,
                duration: 100
            }).start()
        } else if (isSelect('male')) {
            Animated.timing(femaleBoxScale, {
                toValue: 1,
                useNativeDriver: true,
                duration: 100
            }).start()
            Animated.timing(maleBoxScale, {
                toValue: 1.08,
                useNativeDriver: true,
                duration: 100
            }).start()
        }
    }, [gender])
    React.useEffect(() => {
        !locked && navigation?.setOptions({ tabBarVisible: false })
    }, [locked])
    React.useEffect(() => {
        const backAction = () => {
            if (!clients?.length) return false;
            setClients([])
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => {
            backHandler.remove()
        }
    }, [clients])
    if (pageLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator animating={true} color={theme.primary} size={50} />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={{ flex: 0.1 }}>
                <AdMobBanner
                    bannerSize="smartBannerPortrait"
                    adUnitID={bannerRecId}
                    servePersonalizedAds />
            </View>
            {locked ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '95%', marginBottom: '2%' }}>
                        <Text style={{ textAlign: 'center' }}>هذا المحتوى مقفل! شاهد فيديو قصير لعرض المحتوى.</Text>
                        <Text style={{ textAlign: 'center' }}>This content is locked please watch a video to open it.</Text>
                    </View>
                    {isFocused && <Adreward
                        adUnitID={lockedVideoId}
                        name={TAB_NAME}
                        watched={(actionName) => {
                            if (actionName != TAB_NAME) return
                            generateSearchToken()
                        }} />
                    }
                </View>
                :
                <View style={{
                    width: '100%',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    flex: 1,
                }}>
                    <View style={{ width: '95%' }}>
                        <Input onFocus={() => {
                            setClients([])
                        }}
                            label={'Enter Partner Name'}
                            textStyle={{
                                fontSize: 28 / fontScale,
                                paddingVertical: '3%'
                            }}
                            status={'info'}
                            onChangeText={(value) => setSearchName(value)} value={searchName} placeholder={'Partner Name'} placeholderTextColor={'lightgrey'} />
                    </View>
                    {!clients?.length ?
                        <>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                                <TouchableOpacity style={{
                                    ...styles.genderBox, backgroundColor: (isSelect('male') ? theme.primary : 'white'),
                                    transform: [
                                        { scale: maleBoxScale }
                                    ]
                                }} onPress={() => {
                                    setGender('male')
                                }}>
                                    <MaterialCommunityIcons size={55} name={'face-outline'} color={(isSelect('male') ? 'white' : 'black')} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    ...styles.genderBox, backgroundColor: (isSelect('female') ? theme.primary : 'white'),
                                    transform: [
                                        { scale: femaleBoxScale }
                                    ]
                                }} onPress={() => {
                                    setGender('female')
                                }}>
                                    <MaterialCommunityIcons size={55} name={'face-woman-outline'} color={(isSelect('female') ? 'white' : 'black')} />
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                width: '50%',
                            }}>
                                <TouchableOpacity
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        backgroundColor: theme.primary,
                                        padding: 10,
                                        borderRadius: 50,
                                    }}
                                    onPress={() => {
                                        if (loading) return;
                                        setLoading(true)
                                        searcherClient.query({
                                            query: CLIENTS,
                                            variables: {
                                                limit: 20,
                                                where: {
                                                    tel_id: {
                                                        _in: searchClients
                                                    },
                                                    first_name: {
                                                        _ilike: `${searchName.trim()}%`
                                                    },
                                                    gender: {
                                                        _eq: gender
                                                    }
                                                }
                                            },
                                        }).then(({ data }) => {
                                            if (!data?.clients?.length) {
                                                return alert('No Results')
                                            }
                                            Keyboard.dismiss()
                                            setClients(data?.clients)
                                        }).catch(e => {
                                            if (e?.graphQLErrors?.length && e?.graphQLErrors[0].extensions?.code?.includes('invalid-jwt')) {
                                                alert('انتهت صلاحية الجلسة')
                                                setLocked(true)
                                            }
                                        }).finally(() => {
                                            setLoading(false)
                                        })
                                    }}
                                >

                                    <Text style={{ paddingHorizontal: 5, fontSize: 18, color: 'white' }}>Find</Text>
                                    {loading && <ActivityIndicator animating={true} size={20} color={'white'} />}
                                    {!loading && <Feather name="search" size={24} color={'white'} />}
                                </TouchableOpacity>
                            </View>
                        </>
                        :
                        <View style={{ flex: 1 }}>
                            <SearchResults clients={clients} />
                        </View>
                    }
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputs: {
        color: 'black',
        backgroundColor: 'white',
        width: '100%',
        fontSize: 25 / Dimensions.get('window').fontScale,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        paddingRight: 28, // to ensure the text is never behind the icon
    },
    genderBox: { width: '45%', paddingVertical: height / 30, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', }
})

