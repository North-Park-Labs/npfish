import { Chess, Move } from 'chess.js'

import { Engine } from './types'

export const RandomBot: Engine = (board: Chess): string | Move => {
  const moves = board.moves()
  const move = moves[Math.floor(Math.random() * moves.length)]

  return move
}
