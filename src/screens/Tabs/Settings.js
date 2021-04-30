import React from 'react'
import { Button, StyleSheet, Text, View, ActivityIndicator, Dimensions, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useApolloClient } from '@apollo/react-hooks'
import { useSelector, } from 'react-redux'
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ME, UPSERT_USER_INFO } from './../../gql'
import Theme from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
const gender = {
    'male': 'man-outline',
    'female': 'woman-outline'
}
let countries = [
    'سوريا',
    'لبنان',
    "العراق",
    "فلسطين",
    "الأردن",
    "مصر",
    "اليمن",
    "المغرب",
    "الجزائر",
    "السودان",
    "تونس",
    "الإمارات",
    "البحرين",
    "السعودية",
    "الصومال",
    "عمان",
    "المانيا",
    "السويد"
].map((country) => {
    return { label: country, value: country }
})
const { fontScale, height: screenHeight } = Dimensions.get('screen')
export default function Settings() {
    const tel_id = useSelector((state) => state.client.tel_id)
    const [datePickerShow, setDatePickerShow] = React.useState(false)
    const apolloClient = useApolloClient()

    const [client, setClient] = React.useState(null)
    const [saveLoading, setSaveLoading] = React.useState(false)
    let info = client?.info || {}
    React.useEffect(() => {
        apolloClient.query({
            query: ME,
            variables: {
                tel_id
            }
        }).then(({ data }) => {
            setClient(data?.clients_by_pk)
        })
        // if (!client?.info) return
        // setClient(client.info)
    }, [])

    const saveInfo = () => {
        setSaveLoading(true)
        let object = {
            governorate: client?.info?.governorate,
            work: client?.info?.work,
            country: client?.info?.country,
            birthday: client?.info?.birthday,
            education: client?.info?.education,
        }
        apolloClient.mutate({
            mutation: UPSERT_USER_INFO,
            variables: {
                object,
                on_conflict: {
                    constraint: 'user_info_client_id_key',
                    update_columns: ['birthday', 'country', 'education', 'governorate', 'work']
                }
            },
        }).then(() => {
            Alert.alert("", "تم حفظ المعلومات")
        }).finally(() => {
            setSaveLoading(false)
        })
    }
    if (!client) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator animating={true} size={30} color={Theme.primary} />
            </View>
        )
    }
    return (
        <View style={{
            flex: 1, backgroundColor: '#eee'
        }}>
            <View style={{ flex: 1, }}>
                <View style={{ alignItems: 'center', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: screenHeight / 30 }}>
                    <Ionicons size={55} name={gender[client.gender]} />
                    <Text style={{ fontSize: 18 / fontScale, fontWeight: 'bold', color: Theme.primary, marginBottom: 5 }}>{client.first_name}</Text>
                </View>
                <View style={{ flexDirection: 'row', flex: 1, }}>
                    <View style={{ backgroundColor: 'white', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold' }} >مرات الحظر</Text>
                        <Text style={{ fontWeight: 'bold', color: 'red' }} >{client.ban_times}</Text>

                    </View>
                    <View style={{ borderWidth: 0.5, borderColor: '#eee' }}></View>
                    <View style={{ backgroundColor: 'white', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontWeight: 'bold' }}>النقاط</Text>
                        <Text style={{ fontWeight: 'bold', color: '#48C433' }} >{client.points}</Text>
                    </View>
                </View>
            </View>
            <View style={{ flex: 2, backgroundColor: 'white', justifyContent: 'space-evenly', paddingHorizontal: 8 }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 22 / fontScale }}>النبذة الشخصية</Text>
                {/* <View style={{}}> */}
                <RNPickerSelect
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{}}
                    style={pickerSelectStyles}
                    placeholder={{ label: "الدولة", value: null }}
                    onValueChange={(value) => setClient({ ...client, info: { ...info, country: value } })}
                    items={countries}
                    value={info?.country}
                />
                {/* </View> */}
                <TextInput onChangeText={(value) => setClient({ ...client, info: { ...info, governorate: value } })} value={info.governorate} placeholder={'المحافظة'} placeholderTextColor={'lightgrey'} style={styles.inputs} />
                <View onTouchEnd={() => { setDatePickerShow(true) }} style={{ ...styles.inputs, minHeight: screenHeight / 18, justifyContent: 'center' }}>
                    <Text style={{ color: !info.birthday ? 'lightgrey' : 'black', textAlign: 'right' }}>
                        {info.birthday || 'المواليد'}
                    </Text>
                </View>

                <TextInput onChangeText={(value) => setClient({ ...client, info: { ...info, education: value } })} value={info.education} placeholder={'الدراسة'} placeholderTextColor={'lightgrey'} style={styles.inputs} />
                <TextInput onChangeText={(value) => setClient({ ...client, info: { ...info, work: value } })} value={info.work} placeholder={'العمل'} placeholderTextColor={'lightgrey'} style={styles.inputs} />

                {datePickerShow && <DateTimePicker
                    maximumDate={new Date(2009, 12, 30)}
                    testID="dateTimePicker"
                    value={new Date(info.birthday) || new Date()}
                    mode={'date'}
                    is24Hour={true}
                    display={'spinner'}
                    onTouchCancel={() => setDatePickerShow(false)}
                    onChange={(val, date) => {
                        setDatePickerShow(false)
                        if (!date) return;
                        let birthday = new Date(date).toISOString().split('T')[0]
                        setClient({
                            ...client, info: {
                                ...info,
                                birthday
                            }
                        })
                    }}
                />}
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            width: '40%',
                            backgroundColor: Theme.primary,
                            padding: 10,
                            borderRadius: 10,
                        }}
                        onPress={saveInfo}
                    >
                        {saveLoading ? <ActivityIndicator animating={true} size={20} color={'white'} /> :

                            <Text style={{ color: 'white' }}>حفظ</Text>
                        }

                    </TouchableOpacity>
                </View>
            </View>
        </View >
    )
}
const styles = StyleSheet.create({
    inputs: {
        color: 'black',
        fontSize: 14,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        paddingRight: 28, // to ensure the text is never behind the icon
    }
})
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    placeholder: {
        color: 'lightgrey',
        fontSize: 15,
    },
});