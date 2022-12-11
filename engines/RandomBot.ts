import { Chess, Move } from 'chess.js'

import { Engine } from './types'

export const RandomBot: Engine = (board: Chess) => {
  const moves = board.moves()
  const move = moves[Math.floor(Math.random() * moves.length)]

  return {
    move,
    evaluation: 0,
  }
}
