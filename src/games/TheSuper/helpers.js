export function checkCharacters(currentText, activeWord) {
    // if (!character || !currentText || !activeWord) return;
    let isCorrect = activeWord?.text?.startsWith(currentText.trim()) || currentText.trim() == ''
    activeWord = {
        ...activeWord,
        isCorrect,
        ...(isCorrect ? { lenPassed: currentText.length } : {})
    }
    return activeWord
}

export function checkWord(currentText, activeWord) {
    let isCorrect = activeWord?.text == currentText.trim()
    return isCorrect
}