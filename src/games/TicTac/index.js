import React, { useState, useEffect } from 'react'
import { StyleSheet, ActivityIndicator, View, Alert } from 'react-native'
import { useSelector, } from 'react-redux'
import Board from './Board'
import { calculateWinner, isFull } from './helpers'
import { ioSocket } from '../../socket'
let socket;
export default function Game({ partner, me }) {
    const tel_id = useSelector((state) => state.client.tel_id)
    const [squares, setSquares] = useState(Array(9).fill(null))
    const [myTurn, setMyTurn] = useState(false)
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
        socket.on('game state', ({ squares, turn, shape }) => {
            setSquares(squares)
            setMyTurn(Boolean(turn == tel_id))
            setShape(shape)
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
        socket.emit('emptify squares')
    }
    if (isBoardFull) {
        Alert.alert('', "تعادل")
        resetBoard()
    }
    if (winner) {
        if (winner == shape) {
            winner = me.first_name
        } else {
            winner = partner.first_name
        }
        Alert.alert('', `الفائز: ${winner}`)
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
        <Board squares={squares} onClick={handleClick} />
    )
}

const styles = StyleSheet.create({})
