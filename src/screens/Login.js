import React from 'react'
import { StyleSheet, Text, View, Dimensions, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert, Button } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { setTokens } from '../redux/clientSlice'
import { FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useApolloClient } from '@apollo/client'
import Theme from '../theme'
import { AUTH } from '../gql'
const { fontScale, width: screenWidth, height: screenHeight } = Dimensions.get('screen')
export default function Login({ navigation }) {
    const [link, setLink] = React.useState('')
    const [code, setCode] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [mode, updateMode] = React.useState('LINK')
    const apolloClient = useApolloClient();
    const dispatch = useDispatch()

    const auth = () => {
        setLoading(true)
        apolloClient.mutate({
            mutation: AUTH,
            variables: {
                link
            },
            context: {
                headers: {
                    'auth': true,
                }
            }
        }).then(() => {
            updateMode('CODE')
        }).catch(() => { }).finally(() => setLoading(false))
    }
    const verifyCode = () => {
        setLoading(true)
        apolloClient.mutate({
            mutation: AUTH,
            variables: {
                link,
                code
            },
            context: {
                headers: {
                    'auth': true,
                }
            }
        }).then(({ data }) => {
            if (data?.app_auth) {
                dispatch(setTokens({
                    accessToken: data.app_auth.accessToken,
                    refreshToken: data.app_auth.refreshToken,
                    tel_id: data.app_auth.tel_id
                }))
                navigation.navigate('Main')
            } else {
                Alert.alert("", "Incorrect code")
            }
        }).catch(e => {
            Alert.alert("", "Incorrect code")
        }).finally(() => setLoading(false))
    }
    return (
        <View style={styles.loginContainer}>
            <StatusBar style={'light'} backgroundColor={Theme.primary} />
            <View style={styles.topHead}>
                <Text style={{ fontWeight: 'bold', fontSize: 30 / fontScale, color: Theme.primary }}>Hakina tools</Text>
                <Image style={{ width: '40%', height: screenHeight / 5 }} source={require('../../assets/logo.png')} />
            </View>

            <View
                style={styles.centerContent}>
                {mode == 'LINK' ?
                    <>
                        <View style={styles.inputContainer}>
                            <TextInput onChangeText={(val) => setLink(val)} value={link} style={{ padding: 5, }} textAlign={'center'} placeholder={'Your Referral Link'} />
                        </View>
                        <View style={{ ...styles.inputContainer, width: '60%', backgroundColor: 'transparent', }}>
                            <Button title={'where can find my referral link !'}
                                onPress={() => {
                                    Alert.alert("",
                                        `Go to 'Hakina Bot'.\nType '/profile'.\nYou will find your referral link there!`
                                    )
                                }}
                            />
                        </View>
                    </>
                    :
                    <View style={{ ...styles.inputContainer, width: '70%' }}>
                        <TextInput onChangeText={(val) => setCode(val)} value={code} style={{ padding: 10, }} textAlign={'center'} placeholder={'Enter the code...'} />
                    </View>
                }
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        width: '65%',
                        backgroundColor: '#fff',
                        padding: 10,
                        borderRadius: 50,
                        bottom: '20%',
                        position: 'absolute'
                    }}
                    onPress={() => {
                        if (loading) return;
                        mode == 'LINK' ? auth() : verifyCode()
                    }}
                >
                    {loading ? <ActivityIndicator animating={loading} size={20} color={'green'} /> :

                        <>
                            {mode == 'LINK' ?
                                (<>
                                    <Text style={{ paddingHorizontal: 5 }} numberOfLines={1}>Send the code</Text>
                                    <FontAwesome5 name="paper-plane" size={24} color={Theme.primary} />
                                </>)
                                :
                                <Text style={{ paddingHorizontal: 5 }}>Check</Text>
                            }

                        </>
                    }

                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        backgroundColor: '#fff',
        // minHeight: screenHeight
    },
    topHead: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    centerContent: {
        flex: 1.5,
        alignItems: 'center',
        backgroundColor: Theme.primary,
        borderTopStartRadius: 20,
        borderTopEndRadius: 20
    },
    inputContainer: {
        marginTop: screenHeight / 15,
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 15,
        width: '95%',
    }
})
