import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";
const gender = {
    'male': 'face-outline',
    'female': 'face-woman-outline'
}
export default function Client({ item: client, onClick }) {
    const end = moment()
    const duration = moment.duration(end.diff(client.last_seen));
    let seconds = duration.asSeconds();
    return (
        <View style={{
            ...styles.container,
            backgroundColor: (client.is_banned) ? '#FF6E21' : 'white'
        }}>
            <TouchableOpacity
                onPress={() => {
                    onClick(client)
                }}
                style={{
                    width: '100%',
                    height: '100%',
                    paddingHorizontal: 5,
                    justifyContent: 'center',
                    paddingRight: 25,
                    flexDirection: 'row'
                }}>
                <View style={{
                    flex: 0.5,
                    justifyContent: 'center'
                }}>
                    <MaterialIcon size={55} name={gender[client.gender]} color={client.gender == 'female' ? '#4EF795' : '#AACDFE'} />
                </View>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'flex-start'
                }}>
                    <Text style={{ fontSize: 15, paddingBottom: 5, }}>{client.first_name} {client.is_trust && '✅'}</Text>
                    {
                        (client.username) ? <Text style={{ fontSize: 10, }}>@{client.username}</Text> : undefined
                    }
                    <Text style={{ fontSize: 12 }}>{client.telegram_name}</Text>
                </View>
                <View style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    justifyContent: 'space-evenly'
                }}>
                    <Text style={{ fontSize: 10, }}>Ban: ({client.ban_times})</Text>
                    {(seconds <= 50) && <MaterialIcon color={'lightgreen'} size={15} name={'circle'} />}
                    <Text style={{ fontSize: 10, textAlign: 'right' }}>{moment(client.created_at).fromNow()}</Text>
                </View>
            </TouchableOpacity>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 8,
        marginHorizontal: 10,
        borderRadius: 18
    },
})
