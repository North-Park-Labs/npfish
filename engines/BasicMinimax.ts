import { Chess, Move } from 'chess.js'

import { Engine } from './Engine'
import { EngineResponse } from './types'
import { minimax_EXAMPLE } from './utils'

export class BasicMinimaxD23S extends Engine {
  name = 'Minimax (D2,3s)'

  calculateMove({
    board,
    onUpdateResponse,
    onFinish,
  }: {
    board: Chess
    onUpdateResponse: (response: EngineResponse) => void
    onFinish: (response: EngineResponse) => void
  }) {
    const { move, evaluation, numberOfNodesSearched } = minimax_EXAMPLE({
      board,
      depthLimit: 2,
      currentDepth: 0,
      evaluationFunction: evaluateBoard,
      onUpdateResponse,
      numberOfNodesSearched: { count: 0 },
    })

    onFinish({
      move,
      evaluation,
      numberOfNodesSearched: numberOfNodesSearched.count,
    })
  }

  getCalculationTimeInMs(board: Chess): number {
    return 3000
  }
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
