import { Chess, Move } from 'chess.js'

import { Engine } from './Engine'
import { EngineResponse } from './types'

// Improvements I made:
//   - Added alpha beta pruning so can run minimax at depth 3
//   - Added piece placement scoring to evaluation
export class TeddyBot extends Engine {
  name = 'TeddyBot'

  calculateMove({
    board,
    onUpdateResponse,
    onFinish,
  }: {
    board: Chess
    onUpdateResponse: (response: EngineResponse) => void
    onFinish: (response: EngineResponse) => void
  }) {
    const { move, evaluation, numberOfNodesSearched } = minimax({
      board,
      depthLimit: 3,
      currentDepth: 0,
      alpha: -Infinity,
      beta: Infinity,
      evaluationFunction: evaluateBoard,
      onUpdateResponse,
      numberOfNodesSearched: { count: 0 },
    })

    onFinish({
      move,
      evaluation,
      numberOfNodesSearched: numberOfNodesSearched.count,
    })

    return
  }

  getCalculationTimeInMs(board: Chess): number {
    return 15000
  }
}

// Teddy's search algorithm
const minimax = ({
  board,
  depthLimit,
  currentDepth,
  alpha,
  beta,
  evaluationFunction,
  onUpdateResponse,
  numberOfNodesSearched,
}: {
  board: Chess
  depthLimit: number
  currentDepth: number
  alpha: number
  beta: number
  evaluationFunction: (board: Chess) => number
  onUpdateResponse: (response: EngineResponse) => void
  numberOfNodesSearched: { count: 0 } // Pass around an object so its by reference
}): {
  move: Move | string
  evaluation: number
  numberOfNodesSearched: { count: 0 }
} => {
  const isMaximizing = board.turn() === 'w'

  const potentialMoves = board.moves()

  // Randomize order to add some variance
  potentialMoves.sort((a, b) => {
    return 0.5 - Math.random()
  })

  let bestEvaluation = isMaximizing ? -Infinity : Infinity
  let bestMove = potentialMoves[0]

  for (const move of potentialMoves) {
    numberOfNodesSearched.count += 1

    board.move(move)

    // This is our base case
    let childBestMove = move
    let childEvaluation = evaluationFunction(board)

    // This is our recursive case
    if (currentDepth < depthLimit) {
      const { move: mimMove, evaluation: mimEvaluation } = minimax({
        board,
        depthLimit,
        currentDepth: currentDepth + 1,
        alpha,
        beta,
        evaluationFunction,
        onUpdateResponse,
        numberOfNodesSearched,
      })

      childBestMove = mimMove
      childEvaluation = mimEvaluation
    }

    board.undo()

    if (isMaximizing) {
      if (childEvaluation > bestEvaluation) {
        bestEvaluation = childEvaluation
        bestMove = move

        if (currentDepth === 0) {
          onUpdateResponse({
            move: bestMove,
            evaluation: bestEvaluation,
            numberOfNodesSearched: numberOfNodesSearched.count,
          })
        }
      }

      if (childEvaluation > alpha) {
        alpha = childEvaluation
      }
    } else {
      if (childEvaluation < bestEvaluation) {
        bestEvaluation = childEvaluation
        bestMove = move

        if (currentDepth === 0) {
          onUpdateResponse({
            move: bestMove,
            evaluation: bestEvaluation,
            numberOfNodesSearched: numberOfNodesSearched.count,
          })
        }

        if (childEvaluation < beta) {
          beta = childEvaluation
        }
      }
    }

    if (alpha >= beta) {
      break
    }
  }

  return {
    move: bestMove,
    evaluation: bestEvaluation,
    numberOfNodesSearched,
  }
}

// Teddy's Evaluation Algo
const evaluateBoard = (board: Chess) => {
  const squares = board.board()

  let score = 0
  squares.forEach((row, columnNum) => {
    row.forEach((square, rowNum) => {
      if (!square) {
        return
      }

      let pointValue = 0
      if (square.type === 'p') {
        pointValue += 100
      } else if (square.type === 'n') {
        pointValue += 300
      } else if (square.type === 'b') {
        pointValue += 300
      } else if (square.type === 'r') {
        pointValue += 500
      } else if (square.type === 'q') {
        pointValue += 900
      } else if (square.type === 'k') {
        pointValue += 100000
      }

      if (square.color === 'w') {
        score += pointValue
      } else {
        score -= pointValue
      }
    })
  })

  return score / 100
}
