import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

export default function Square({ value, onClick, index }) {
    let squareBorder = {}
    if ([0, 1, 2].includes(index)) {
        squareBorder.borderTopWidth = 0
        squareBorder.borderBottomWidth = 0
    }
    if ([0, 3, 6].includes(index)) {
        squareBorder.borderRightWidth = 0
        squareBorder.borderLeftWidth = 0
    }
    if ([2, 5, 8].includes(index)) {
        squareBorder.borderRightWidth = 0
        squareBorder.borderLeftWidth = 0
    }
    if ([6, 7, 8].includes(index)) {
        squareBorder.borderTopWidth = 0
        squareBorder.borderBottomWidth = 0
    }
    return (
        <TouchableOpacity style={{ ...styles.square, ...squareBorder }} onPress={onClick}>
            <Text style={{ fontSize: 28 }}>{value}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    square: {
        width: '30%',
        maxWidth: '30%',
        height: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        backgroundColor: '#eee'
    }
})
