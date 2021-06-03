import React, { useState, useEffect } from 'react'
import { StyleSheet, ActivityIndicator, View, Alert, Text, Dimensions } from 'react-native'
import { useSelector, } from 'react-redux'
import Board from './Board'
import { calculateWinner, isFull } from './helpers'
import Theme from './../../theme'
import { ioSocket } from '../../socket'
const { width, height } = Dimensions.get('screen')
let socket;
export default function Game({ partner, me }) {
    const tel_id = useSelector((state) => state.client.tel_id)
    const [squares, setSquares] = useState(Array(9).fill(null))
    const [myTurn, setMyTurn] = useState(false)
    const [scores, setScores] = useState({
        myScore: 0,
        partnerScore: 0
    })
    const [shape, setShape] = useState('')
    let winner = calculateWinner(squares);
    const isBoardFull = isFull(squares);
    useEffect(() => {
        socket = ioSocket({ namespace: '/tictac' })
        socket.on('connect', (data) => { });
        socket.on('init game', () => {
            setMyTurn(true)
            setShape('O')
        });
        socket.on('game state', ({ squares, turn, shape, myScore, partnerScore }) => {
            setSquares(squares)
            setMyTurn(Boolean(turn == tel_id))
            setShape(shape)
            setScores({ myScore, partnerScore })
        });
        socket.on('played', ({ squares }) => {
            partnerPlayed(squares)
        });
        return () => {
            socket.disconnect()
        }
    }, [])
    const partnerPlayed = (squares) => {
        setSquares(squares)
        setMyTurn(true)
    }
    const resetBoard = () => {
        let newSquares = Array(9).fill(null)
        setSquares(newSquares)
    }
    if (isBoardFull) {
        Alert.alert('', "تعادل")
        resetBoard()
    }
    if (winner) {
        if (winner == shape) {
            Alert.alert('', `الفائز: ${me.first_name}`)
            setScores({
                ...scores,
                myScore: Number(scores.myScore) + 1
            })
        } else {
            Alert.alert('', `الفائز: ${partner.first_name}`)
            setScores({
                ...scores,
                partnerScore: Number(scores.partnerScore) + 1
            })
        }
        resetBoard()
    }
    const handleClick = (i) => {
        if (squares[i] || !myTurn) return;
        setMyTurn(false)
        let newSquares = [...squares]
        newSquares[i] = shape
        setSquares(newSquares);
        socket.emit('square clicked', { squares: newSquares })
    }
    if (!shape) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator animating={true} size={55} color={'blue'} />
            </View>
        )
    }
    return (
        <View style={{ flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>

            <View style={{ width: width - 50, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', }}>

                <View style={{ alignItems: 'center', justifyContent: 'center', width: '30%' }}>
                    <Text>{partner.first_name}</Text>
                    <Text style={{ backgroundColor: Theme.primary, color: 'white', borderRadius: 10, width: '35%', textAlign: 'center', marginTop: 5 }}>{scores.partnerScore}</Text>
                </View>
                <Text style={{ backgroundColor: myTurn ? '#40C726' : '#D8362A', color: 'white', borderRadius: 20, padding: 10, top: -(height / 20) }}>{
                    myTurn ? 'دورك' : 'دور شريكك'
                }</Text>
                <View style={{ alignItems: 'center', justifyContent: 'center', width: '30%' }}>
                    <Text>{me.first_name}</Text>
                    <Text style={{ backgroundColor: Theme.primary, color: 'white', borderRadius: 10, width: '35%', textAlign: 'center', marginTop: 5 }}>{scores.myScore}</Text>
                </View>
            </View>
            <Board squares={squares} onClick={handleClick} />
        </View>
    )
}
