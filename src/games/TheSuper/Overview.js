import React from 'react'
import { StyleSheet, Text, View, Image, Dimensions, Animated } from 'react-native'
import theme from '../../theme'
const { height: screenHeight, width: screenWidth, fontScale } = Dimensions.get('screen')
export default function Overview({ players }) {
    return (
        <View style={styles.container}>
            {
                players.filter((p) => p.connected).map((player, i) => (
                    <View key={i} style={{ ...styles.playerLine, borderColor: player.self ? theme.primary : 'tomato' }}>
                        <View style={styles.player}>
                            <Text style={{ textAlign: 'center', fontSize: 14 / fontScale, color: 'grey' }}>{player.first_name} (<Text>{player?.score}</Text>)</Text>
                            <Animated.View style={{
                                left: `${player.progress - (screenWidth / 100)}%`
                            }}>
                                <Image resizeMode={'contain'} style={styles.playerLogo} source={require('../../../assets/logo.png')} />
                            </Animated.View>
                        </View>
                    </View>
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10
    },
    playerLine: {
        marginBottom: '4%',
        borderBottomWidth: 3,
    },
    player: {
        // backgroundColor: 'black',
        top: '30%'
    },
    playerLogo: {
        width: screenWidth / 10,
        marginLeft: -10,
        height: screenHeight / 20,
    }
})
