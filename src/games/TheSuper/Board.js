import React, { useRef, useState, forwardRef, useImperativeHandle, memo, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native'
import theme from '../../theme'
const { height: screenHeight, width: screenWidth, fontScale } = Dimensions.get('screen')
const Board = forwardRef(({ words, activeWord }, ref) => {

    const scrollViewRef = useRef(null);
    const [dataSourceCords, setDataSourceCords] = useState([]);
    useImperativeHandle(ref, () => ({

        next() {
            if (scrollViewRef.current !== null && dataSourceCords[activeWord.index]) {
                scrollViewRef.current.scrollTo({
                    x: dataSourceCords[activeWord.index]?.x - dataSourceCords[activeWord.index + 1]?.width,
                    y: 0,
                    animated: true,
                });
            }
        }

    }));
    useEffect(() => {
        if (scrollViewRef.current !== null && dataSourceCords[activeWord.index]) {
            scrollViewRef.current.scrollTo({
                x: dataSourceCords[activeWord.index]?.x - dataSourceCords[activeWord.index + 1]?.width,
                y: 0,
                animated: true,
            });
        } else {
            scrollViewRef.current.scrollToEnd({ animated: true })
        }
    }, [])
    return (
        <ScrollView style={styles.container}
            horizontal
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                flexDirection: 'row-reverse',
                // justifyContent: 'flex-end',
                // width: '100%',
                // backgroundColor: 'red',
                direction: 'rtl',
                alignItems: 'center',
                paddingHorizontal: 10
            }}>
            {words.map((word, i) => {
                let wordActiveLen;
                let passed;
                let left;
                if (word.active) {
                    wordActiveLen = activeWord.len
                    passed = activeWord.text.substring(0, activeWord.lenPassed || 0)
                    left = activeWord.text.substring(activeWord.lenPassed || 0, wordActiveLen)
                }
                return (
                    <View key={word.index} onLayout={(event) => {
                        const layout = event.nativeEvent.layout;
                        dataSourceCords[word.index] = { x: layout.x, width: layout.width };
                        setDataSourceCords(dataSourceCords);
                    }}>
                        {word.active ?
                            <Text style={{ ...styles.word, ...styles.activeWord, ...(!activeWord.isCorrect ? styles.wrongWord : {}) }}>
                                <Text style={{ ...styles.passedCharacters }}>
                                    {passed}
                                </Text>
                                {left}
                            </Text>
                            :
                            <Text style={styles.word}>{word.text}</Text>
                        }

                    </View>
                )
            })}
        </ScrollView>
    )
})
export default memo(Board);
const styles = StyleSheet.create({
    container: {
        // flex: 1,
        maxHeight: screenHeight / 15,
        backgroundColor: theme.primary,
    },
    content: {
        backgroundColor: 'white',
    },
    word: {
        color: 'white',
        padding: 10,
        fontSize: 16 / fontScale,
    },
    activeWord: {
        fontSize: 20 / fontScale,
        fontWeight: 'bold',
        color: '#fff'
    },
    passedCharacters: {
        color: '#25DB65'
    },
    wrongWord: {
        color: '#D44105'
    }
})
