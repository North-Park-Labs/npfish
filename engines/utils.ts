import { Chess, Move } from 'chess.js'

import { Engine } from './Engine'
import { EngineResponse } from './types'

/**
 * DO NOT MODIFY DIRECTLY
 * If you want to modify, please c/p paste.
 * @param response - this holds the reference to what the engine will respond with after timeout
 * @param board
 * @param depth
 * @param evaluationFunction - return postiive for better white position, negative for better black position
 */
export const minimax_EXAMPLE = ({
  board,
  depthLimit,
  currentDepth,
  evaluationFunction,
  onUpdateResponse,
}: {
  board: Chess
  depthLimit: number
  currentDepth: number
  evaluationFunction: (board: Chess) => number
  onUpdateResponse: (response: EngineResponse) => void
}): {
  move: Move | string
  evaluation: number
} => {
  const isMaximizing = board.turn() === 'w'

  const potentialMoves = board.moves()

  // Randomize order to add some variance
  potentialMoves.sort((a, b) => {
    return 0.5 - Math.random()
  })

  let bestEvaluation = isMaximizing ? -Infinity : Infinity
  let bestMove = potentialMoves[0]
  if (currentDepth === 0) {
  }
  potentialMoves.forEach((move) => {
    const boardCopy = new Chess(board.fen())
    boardCopy.move(move)

    // This is our base case
    let childBestMove = move
    let childEvaluation = evaluationFunction(boardCopy)

    // This is our recursive case
    if (currentDepth < depthLimit) {
      const { move: mimMove, evaluation: mimEvaluation } = minimax_EXAMPLE({
        board: boardCopy,
        depthLimit,
        currentDepth: currentDepth + 1,
        evaluationFunction,
        onUpdateResponse,
      })

      childBestMove = mimMove
      childEvaluation = mimEvaluation
    }

    if (isMaximizing) {
      if (childEvaluation > bestEvaluation) {
        bestEvaluation = childEvaluation
        bestMove = move

        if (currentDepth === 0) {
          onUpdateResponse({
            move: bestMove,
            evaluation: bestEvaluation,
            numberOfNodesSearched: 0,
          })
        }
      }
    } else {
      if (childEvaluation < bestEvaluation) {
        bestEvaluation = childEvaluation
        bestMove = move

        if (currentDepth === 0) {
          onUpdateResponse({
            move: bestMove,
            evaluation: bestEvaluation,
            numberOfNodesSearched: 0,
          })
        }
      }
    }
  })

  return {
    move: bestMove,
    evaluation: bestEvaluation,
  }
}
