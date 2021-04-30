import React from 'react'
import Theme from '../../theme'

import {
    connectAsync,
    disconnectAsync,
    finishTransactionAsync,
    getProductsAsync,
    IAPResponseCode,
    purchaseItemAsync,
    setPurchaseListener,
} from 'expo-in-app-purchases';
import {
    TouchableOpacity,
    Platform,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    // NativeModule,
    ActivityIndicator,
    View,
    Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSelector, } from 'react-redux'
import { useApolloClient } from '@apollo/react-hooks'
import { PURCHASE } from '../../gql'
// function hasIAP() {
//   return !!NativeModules.RNIapModule;
// }
const { fontScale, width: screenWidth, height: screenHeight } = Dimensions.get('screen')
export default function Store() {
    const tel_id = useSelector((state) => state.client.tel_id)
    const [state, setState] = React.useState({
        items: [],
        loading: true
    })
    const apolloClient = useApolloClient();
    const verifyPurchase = (receipt) => {
        return apolloClient.mutate({
            mutation: PURCHASE,
            variables: {
                receipt
            }
        })
    }
    React.useEffect(() => {
        const bootstrapAsync = async () => {
            await connectAsync();
            const items = Platform.select({
                ios: [],
                android: ['75_points', '250_points', '500_points'],
            });
            const { responseCode, results } = await getProductsAsync(items);
            if (responseCode === IAPResponseCode.OK) {
                setState({ items: results, loading: false });
            }

            // Set purchase listener
            setPurchaseListener(async ({ responseCode, results, errorCode }) => {
                if (responseCode === IAPResponseCode.OK) {
                    const purchase = results[0]
                    let key = purchase.productId.split('_')[0]
                    const points = {
                        '75': 50,
                        '500': 400,
                        '250': 200
                    }
                    await finishTransactionAsync(purchase, true);
                    purchase.points = points[key]
                    purchase.user_id = tel_id
                    verifyPurchase(purchase).then((data) => {
                        Alert.alert("", "نجح الشراء")
                    }).catch((e) => {
                        Alert.alert("", "فشل")
                    })
                    // }
                } else if (responseCode === IAPResponseCode.USER_CANCELED) {
                    Alert.alert("", "إلتغت")
                } else {
                    console.warn(
                        `Something went wrong with the purchase. Received response code ${responseCode} and errorCode ${errorCode}`
                    );
                }
            });
        }
        bootstrapAsync()
        return async () => {
            await disconnectAsync();
        }
    }, [])

    const renderItem = (item) => {
        return (
            <View key={item.productId} style={{
                flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'space-around', alignItems: 'center',
                borderRadius: 5,
                paddingVertical: 10,
                borderBottomWidth: 0.5,
                borderColor: '#eee'
            }}>
                <Text style={styles.itemTitle}>{item.title.split('(')[0]}</Text>
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        backgroundColor: Theme.primary,
                        padding: 10,
                        borderRadius: 50,
                    }}
                    onPress={() => {
                        purchaseItemAsync(item.productId)
                    }}
                >
                    <Text style={{ color: '#fff' }}>{`${item.price} ${item.priceCurrencyCode}`}</Text>
                </TouchableOpacity>
            </View>
        );
    }
    return (
        <View style={{ flex: 1 }}>
            <StatusBar style={'light'} backgroundColor={Theme.primary} />
            <View style={styles.topHead}>
                <Text style={{ fontWeight: 'bold', fontSize: 30 / fontScale, color: Theme.primary }}>متجر حاكينا</Text>
                <Image style={{ width: '40%', height: screenHeight / 5 }} source={require('../../../assets/logo.png')} />
            </View>
            {state.loading ?
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator animating={true} size={30} color={Theme.primary} />
                </View> :
                <View style={{ flex: 2, paddingVertical: screenHeight / 20 }}>
                    {state.items.map(item => renderItem(item))}
                </View>
            }

        </View>
        // <ScrollView>

        //     {state.items.map(item => renderItem(item))}
        //     <View style={styles.buttonContainer}>
        //         <Button title="Update Response Code" onPress={() => getBillingResult()} />
        //     </View>
        //     <View style={styles.container}>
        //         <Text style={styles.itemTitle}>{state.responseCode}</Text>
        //     </View>
        // </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    topHead: {
        flex: 1,
        marginTop: screenHeight / 14,
        alignItems: 'center',
    },
    itemTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
});