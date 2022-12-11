import { Chess, Move } from 'chess.js'

import { Engine } from './types'
import { minimax_EXAMPLE } from './utils'

export const MinimaxDepth1: Engine = (board: Chess): string | Move => {
  const { move, evaluation } = minimax_EXAMPLE(board, 1, evaluateBoard)

  return move
}

export const MinimaxDepth2: Engine = (board: Chess): string | Move => {
  const { move, evaluation } = minimax_EXAMPLE(board, 2, evaluateBoard)

  return move
}

export const MinimaxDepth3: Engine = (board: Chess): string | Move => {
  const { move, evaluation } = minimax_EXAMPLE(board, 3, evaluateBoard)

  return move
}

const evaluateBoard = (board: Chess) => {
  const squares = board.board()

  let score = 0
  squares.forEach((row) => {
    row.forEach((square) => {
      if (!square) {
        return
      }
      let pointValue = 0
      if (square.type === 'p') {
        pointValue += 1
      } else if (square.type === 'n') {
        pointValue += 3
      } else if (square.type === 'b') {
        pointValue += 3
      } else if (square.type === 'r') {
        pointValue += 5
      } else if (square.type === 'q') {
        pointValue += 9
      } else if (square.type === 'k') {
        pointValue += 10000
      }

      if (square.color === 'w') {
        score += pointValue
      } else {
        score -= pointValue
      }
    })
  })

  return score
}
