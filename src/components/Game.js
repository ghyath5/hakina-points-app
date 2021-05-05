import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function Game(props) {
    return (
        <TouchableOpacity onPress={props.onClick} style={{ backgroundColor: 'white', padding: 100, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 25 }}>{props.name}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({})
