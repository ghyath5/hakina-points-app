window.navigator.userAgent = "react-native";
import io from 'socket.io-client'
import { store } from './redux/store'
export const ioSocket = ({ namespace }) => {
    let state = store.getState()
    let accessToken = state?.client?.accessToken
    if (!accessToken) return;
    return io(`https://hakina.herokuapp.com${namespace}`, {
        transports: ['websocket'],
        reconnectionAttempts: 15,
        extraHeaders: {
            authorization: accessToken
        }
    });
}