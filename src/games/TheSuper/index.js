import React, { useState, useEffect, useRef, useMemo } from 'react'
import { StyleSheet, ActivityIndicator, View, TextInput, Dimensions, Text, Keyboard, Alert } from 'react-native'
import { useSelector, } from 'react-redux'
import Overlay from './../../components/Overlay'
import { checkCharacters, checkWord } from './helpers'
import Board from './Board'
import Overview from './Overview'
import { ioSocket } from '../../socket'
let socket;
export default function Game({ partner, me }) {
    const tel_id = useSelector((state) => state.client.tel_id)
    // const [sounds, setSounds] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [currentText, setCurrentText] = useState('')
    const [activeIndex, setActiveIndex] = useState(0)
    const [overlay, setOverlay] = useState('في انتظار الشريك ...')
    const [text, setText] = useState('جار التحميل')
    const boardRef = useRef(null)
    const input = useRef(null)
    const wordsArr = text.split(' ')

    let words = wordsArr.map((word, i) => {
        return {
            index: i,
            active: i == activeIndex,
            text: word,
            len: word.length
        }
    })
    let activeWord = words.find((word) => word.active)
    activeWord = checkCharacters(currentText, activeWord)
    const isWordCorrect = checkWord(currentText, activeWord)
    const [mePlayer, setMePlayer] = useState({ progress: 0, score: 0, connected: true })
    const [partnerPlayer, setPartnerPlayer] = useState({ progress: 0, score: 0, connected: false })
    const resetGame = () => {
        setActiveIndex(0)
    }
    if (isWordCorrect) {
        const progress = ((activeWord.index + 1) * 100 / words.length)
        socket?.emit('playerProgress', { partnerId: partner.tel_id, progress })
        setCurrentText('')
        setActiveIndex(activeIndex + 1)
        setMePlayer({
            ...mePlayer,
            progress
        })
        if (progress >= 100) {
            Alert.alert("", "انت الرابح")
            resetGame()
            setMePlayer({
                ...mePlayer,
                progress: 0,
                score: Number(mePlayer.score) + 1
            })
        }
        setTimeout(() => {
            boardRef.current.next()
        }, 10)

    }
    useEffect(() => {
        socket = ioSocket({ namespace: '/thesuper' })
        socket.on('connect', () => { });

        socket.on('init game', ({ game, connected, text }) => {
            checkPartner(connected)
            const me = game.players.find(player => player.tel_id == tel_id)
            const partner = game.players.find(player => player.tel_id != tel_id)
            setText(text)
            setPartnerPlayer({
                ...partnerPlayer,
                score: partner.score,
                connected: Boolean(connected)
            })
            setMePlayer({
                ...mePlayer,
                score: me.score
            })
            setIsLoading(false)
        });
        socket.on('playerProgress', ({ progress, score }) => {
            setPartnerPlayer({
                ...partnerPlayer,
                connected: true,
                score,
                progress
            })
        });
        socket.on('game over', ({ text }) => {

            setText(text)
        })
        socket.on('playerStatus', ({ connected, score }) => {
            checkPartner(connected)
            setPartnerPlayer({
                ...partnerPlayer,
                score,
                connected: Boolean(connected)
            })
        })
        socket.on('partnerWin', ({ score, text }) => {
            resetGame()
            setText(text)
            setPartnerPlayer({
                ...partnerPlayer,
                score: Number(score),
                connected: true
            })
            Alert.alert("", "لقد خسرت")
        })
        return () => {
            socket.disconnect()
        }
    }, [])

    const checkPartner = (connected) => {
        if (connected) {
            let begainTime = 5 //in seconds
            let interval = setInterval(() => {
                begainTime--
                setOverlay(<Text>{begainTime}</Text>)
                if (begainTime <= 0) {
                    clearInterval(interval)
                    setOverlay(null)
                    input?.current?.focus()
                }
            }, 1000)
        } else {
            setOverlay('في انتظار الشريك ...')
            Keyboard.dismiss()
        }
    }
    const renderBoard = (props) => <Board {...props} ref={boardRef} />
    const MemoBoard = useMemo(() => renderBoard, [])

    // useEffect(() => {
    //     const bootstrap = async () => {
    //         const { sound: keyEffect } = await Audio.Sound.createAsync(
    //             require('./../../../assets/sounds/key.mp3'),
    //         )
    //         const { sound: wrongEffect } = await Audio.Sound.createAsync(
    //             require('./../../../assets/sounds/falses.mp3'),
    //         )
    //         setSounds({
    //             keyEffect,
    //             wrongEffect
    //         })
    //     }
    //     bootstrap()
    //     return () => {
    //         // sounds.keyEffect.unloadAsync();
    //         // sounds.wrongEffect.unloadAsync();
    //     }
    // }, [])
    // const keyPress = async () => {
    //     await Audio.Sound.createAsync(
    //         require('./../../../assets/sounds/key.mp3'),
    //         { shouldPlay: true }
    //     )
    // }
    // const wrongPress = async () => {
    //     await Audio.Sound.createAsync(
    //         require('./../../../assets/sounds/falses.mp3'),
    //         { shouldPlay: true }
    //     )
    // }
    if (isLoading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator animating={true} size={55} color={'blue'} />
            </View>
        )
    }
    return (
        <>
            {overlay &&
                <Overlay content={overlay} />
            }
            <View style={styles.container}>
                <Overview players={[
                    {
                        ...me,
                        ...mePlayer,
                        self: true
                    },
                    {
                        ...partner,
                        ...partnerPlayer
                    }
                ]} />

                <MemoBoard words={words} activeWord={activeWord} />
                <TextInput style={{ backgroundColor: 'white', padding: 8, fontSize: 18 }}
                    ref={input}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    textAlign={'center'}
                    value={currentText}
                    placeholder={'اكتب هنا ...'}
                    onKeyPress={async (e) => {
                        if (!['Enter', 'Backspace'].includes(e.nativeEvent.key) && e.nativeEvent.key.length > 1) {
                            e.preventDefault()
                            setCurrentText('')
                        }
                        // if (!activeWord.isCorrect) {
                        //     console.log('wrong');
                        //     return wrongPress()
                        // }
                        // keyPress()
                    }}
                    onChangeText={(text) => {
                        const currentCharacter = text[text.length - 1]
                        if (currentCharacter == ' ') return;
                        if (!activeWord.isCorrect && text.length >= currentText.length) {
                            return
                        }
                        if (text.length > currentText.length + 1) return
                        setCurrentText(text)
                    }}
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-evenly',
    }
})
