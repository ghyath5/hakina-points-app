import React from 'react'
import { StyleSheet, Animated } from 'react-native'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { StatusBar } from 'expo-status-bar'
const fullyTime = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(14, 5)
}
export default function Timer(props) {
    let barColor = props.timeToEnter >= 400 ? '#FF4732' :
        props.timeToEnter >= 200 ? '#DBAE00'
            :
            '#48C433'
    return (
        <>
            <StatusBar style={'light'} backgroundColor={barColor} />
            <CountdownCircleTimer
                isPlaying
                trailColor={'#eee'}
                duration={60 * 10}
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
