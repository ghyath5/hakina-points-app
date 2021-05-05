import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Square from './Square'
export default function Board({ squares, onClick }) {
    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {squares.map((square, i) => (
                <Square key={i} index={i} value={square} onClick={() => onClick(i)} />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({})
