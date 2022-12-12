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
  numberOfNodesSearched,
}: {
  board: Chess
  depthLimit: number
  currentDepth: number
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

  potentialMoves.forEach((move) => {
    numberOfNodesSearched.count += 1

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
        numberOfNodesSearched,
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
            numberOfNodesSearched: numberOfNodesSearched.count,
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
            numberOfNodesSearched: numberOfNodesSearched.count,
          })
        }
      }
    }
  })

  return {
    move: bestMove,
    evaluation: bestEvaluation,
    numberOfNodesSearched,
  }
}

/**
 * DO NOT MODIFY DIRECTLY
 * If you want to modify, please c/p paste.
 * @param response - this holds the reference to what the engine will respond with after timeout
 * @param board
 * @param depth
 * @param evaluationFunction - return postiive for better white position, negative for better black position
 */
export const minimaxWithPruning_EXAMPLE = ({
  board,
  depthLimit,
  currentDepth,
  evaluationFunction,
  onUpdateResponse,
  numberOfNodesSearched,
}: {
  board: Chess
  depthLimit: number
  currentDepth: number
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

  potentialMoves.forEach((move) => {
    numberOfNodesSearched.count += 1

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
        numberOfNodesSearched,
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
            numberOfNodesSearched: numberOfNodesSearched.count,
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
            numberOfNodesSearched: numberOfNodesSearched.count,
          })
        }
      }
    }
  })

  return {
    move: bestMove,
    evaluation: bestEvaluation,
    numberOfNodesSearched,
  }
}
