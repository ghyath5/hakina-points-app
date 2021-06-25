import React from 'react'
import { StyleSheet, Animated } from 'react-native'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { StatusBar } from 'expo-status-bar'
const fullyTime = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11, 8)
}
const duration = 60 * 45
const statusColor = (time) => {
    const percentage = time * 100 / duration
    if (percentage > 45) {
        return '#FF4732'
    } else if (percentage > 75) {
        return '#DBAE00'
    } else {
        return '#48C433'
    }
}
export default function Timer(props) {
    let barColor = statusColor(props.timeToEnter)
    return (
        <>
            <StatusBar style={'light'} backgroundColor={barColor} />
            <CountdownCircleTimer
                isPlaying
                trailColor={'#eee'}
                duration={duration}
                initialRemainingTime={props.timeToEnter}
                colors={[
                    ['#FF4732', 0.6],
                    ['#DBAE00', 0.2],
                    ['#48C433', 0.2]
                ]}
                onComplete={() => {
                    props.timerDone()
                    return [false, 0]
                }}
            >
                {({ remainingTime, animatedColor }) => (
                    <Animated.Text style={{ ...styles.remainingTime, color: animatedColor }}>
                        {fullyTime(remainingTime)}
                    </Animated.Text>
                )}
            </CountdownCircleTimer>
        </>
    )
}

const styles = StyleSheet.create({})
