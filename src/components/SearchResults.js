import React, { useState } from 'react'
import { FlatList, View, Modal, Dimensions, Alert, Keyboard } from 'react-native'
import Client from './Client'
import sign from '../sign'
import { useSelector } from 'react-redux'
import { useApolloClient, } from '@apollo/react-hooks'
import { Input, Text, Button, Spinner } from '@ui-kitten/components';
import { SEND_PRIVATE_MESSAGE } from '../gql'
const screen = Dimensions.get('screen')
export default function SearchResults({ clients }) {
    const apolloClient = useApolloClient()
    const [client, setClient] = useState({})
    const [message, setMessage] = useState('')
    const [sendLoading, setSendLoading] = useState(false)
    const renderItem = (props) => <Client {...props} onClick={(client) => {
        setClient(client)
        setModalVisible(true)
    }} />
    const memoRenderItem = React.useMemo(() => renderItem, [])
    const [modalVisible, setModalVisible] = useState(false);
    const tel_id = useSelector((state) => state.client.tel_id)
    let signToken = sign({ target: 'SPM', tel_id })
    const sendMessage = () => {
        if (sendLoading || !message) return;
        setSendLoading(true)
        apolloClient.mutate({
            mutation: SEND_PRIVATE_MESSAGE,
            variables: {
                data: {
                    key: signToken,
                    receiver_id: client.tel_id,
                    message
                }
            }
        }).then(({ data }) => {
            Alert.alert('', data?.send_private_message.message)
            setModalVisible(false)
            setMessage('')
        }).catch(e => {
            Alert.alert('فشل ارسال رسالتك!')
        }).finally(() => {
            setSendLoading(false)
            Keyboard.dismiss()
        })
    }
    const LoadingIndicator = (props) => (
        <View style={[props.style]}>
            {sendLoading && <Spinner size='small' />}
        </View>
    );
    return (
        <View style={{ paddingTop: 10 }}>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false)
                }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text status='info' category={'h6'}>إرسال رسالة إلى ({client.first_name})</Text>
                        <Text appearance='hint'>
                            سيتم خصم 20 نقطة بعد ارسال الرسالة.
                        </Text>
                    </View>
                    <View style={{
                        width: '90%',
                        flex: 0.5,
                        justifyContent: 'flex-end'
                    }}>
                        <Input
                            multiline={true}
                            textStyle={{ minHeight: screen.height / 8, maxHeight: screen.height / 4 }}
                            placeholder={'ادخل رسالتك هنا...'}
                            onChangeText={(value) => setMessage(value)} value={message}
                        />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Button accessoryLeft={sendLoading && LoadingIndicator} appearance='outline' status='info' onPress={sendMessage}>
                            ارسال
                        </Button>
                    </View>

                </View>
            </Modal>
            <FlatList
                data={clients}
                renderItem={memoRenderItem}
                keyExtractor={(item) => item.tel_id}
                contentContainerStyle={{ flexGrow: 1 }}
            />
        </View>
    )
}
