export const games = [
    {
        name: 'Tic Tac',
        path: 'TicTac'
    }
]
import TicTac from './TicTac'
const GAMES = {
    TicTac
}
export default function LoadGame(game) {
    return GAMES[game]
}

