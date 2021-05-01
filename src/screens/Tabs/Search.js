import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import theme from '../../theme'

export default function Search() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 30, color: theme.primary }}>قادم قريباً</Text>
        </View>
    )
}

const styles = StyleSheet.create({})
