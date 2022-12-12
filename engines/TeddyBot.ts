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
        pointValue += 280
      } else if (square.type === 'b') {
        pointValue += 320
      } else if (square.type === 'r') {
        pointValue += 479
      } else if (square.type === 'q') {
        pointValue += 929
      } else if (square.type === 'k') {
        pointValue += 60000
      }

      pointValue +=
        piecePlacementValue[square.type][
          square.color === 'b' ? 7 - columnNum : columnNum
        ][rowNum]

      if (square.color === 'w') {
        score += pointValue
      } else {
        score -= pointValue
      }
    })
  })

  return score / 100
}

// 0 0 is a8
// 0 1 is b8

const piecePlacementValue = {
  p: [
    [100, 100, 100, 100, 105, 100, 100, 100],
    [78, 83, 86, 73, 102, 82, 85, 90],
    [7, 29, 21, 44, 40, 31, 44, 7],
    [-17, 16, -2, 15, 14, 0, 15, -13],
    [-26, 3, 10, 9, 6, 1, 0, -23],
    [-22, 9, 5, -11, -10, -2, 3, -19],
    [-31, 8, -7, -37, -36, -14, 3, -31],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  n: [
    [-66, -53, -75, -75, -10, -55, -58, -70],
    [-3, -6, 100, -36, 4, 62, -4, -14],
    [10, 67, 1, 74, 73, 27, 62, -2],
    [24, 24, 45, 37, 33, 41, 25, 17],
    [-1, 5, 31, 21, 22, 35, 2, 0],
    [-18, 10, 13, 22, 18, 15, 11, -14],
    [-23, -15, 2, 0, 2, 0, -23, -20],
    [-74, -23, -26, -24, -19, -35, -22, -69],
  ],
  b: [
    [-59, -78, -82, -76, -23, -107, -37, -50],
    [-11, 20, 35, -42, -39, 31, 2, -22],
    [-9, 39, -32, 41, 52, -10, 28, -14],
    [25, 17, 20, 34, 26, 25, 15, 10],
    [13, 10, 17, 23, 17, 16, 0, 7],
    [14, 25, 24, 15, 8, 25, 20, 15],
    [19, 20, 11, 6, 7, 6, 20, 16],
    [-7, 2, -15, -12, -14, -15, -10, -10],
  ],
  r: [
    [35, 29, 33, 4, 37, 33, 56, 50],
    [55, 29, 56, 67, 55, 62, 34, 60],
    [19, 35, 28, 33, 45, 27, 25, 15],
    [0, 5, 16, 13, 18, -4, -9, -6],
    [-28, -35, -16, -21, -13, -29, -46, -30],
    [-42, -28, -42, -25, -25, -35, -26, -46],
    [-53, -38, -31, -26, -29, -43, -44, -53],
    [-30, -24, -18, 5, -2, -18, -31, -32],
  ],
  q: [
    [6, 1, -8, -104, 69, 24, 88, 26],
    [14, 32, 60, -10, 20, 76, 57, 24],
    [-2, 43, 32, 60, 72, 63, 43, 2],
    [1, -16, 22, 17, 25, 20, -13, -6],
    [-14, -15, -2, -5, -1, -10, -20, -22],
    [-30, -6, -13, -11, -16, -11, -16, -27],
    [-36, -18, 0, -19, -15, -15, -21, -38],
    [-39, -30, -31, -13, -31, -36, -34, -42],
  ],
  k: [
    [4, 54, 47, -99, -99, 60, 83, -62],
    [-32, 10, 55, 56, 56, 55, 10, 3],
    [-62, 12, -57, 44, -67, 28, 37, -31],
    [-55, 50, 11, -4, -19, 13, 0, -49],
    [-55, -43, -52, -28, -51, -47, -8, -50],
    [-47, -42, -43, -79, -64, -32, -29, -32],
    [-4, 3, -14, -50, -57, -18, 13, 4],
    [17, 30, -3, -40, 6, -40, 50, 18],
  ],
}
