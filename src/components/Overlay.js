import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function Overlay({ content }) {
    return (
        <View style={styles.container}>
            <Text style={styles.content}>{content}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#39252b8c',
        top: 0,
        left: 0,
        zIndex: 24
    },
    content: {
        fontSize: 20,
        color: 'white'
    }
})
