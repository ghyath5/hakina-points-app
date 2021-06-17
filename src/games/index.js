import TicTac from './TicTac'
import TheSuper from './TheSuper'

export const games = [
    {
        name: 'Tic Tac',
        path: 'TicTac'
    },
    {
        name: 'The Super',
        path: 'TheSuper'
    }
]
const GAMES = {
    TicTac,
    TheSuper
}
export default function LoadGame(game) {
    return GAMES[game]
}

