import { Chess, Move } from 'chess.js'

import { Engine } from './Engine'
import { EngineResponse } from './types'
import { minimax_EXAMPLE } from './utils'

export class AlexBot extends Engine {
  name = 'AlexBot' // TODO: Update the engine name here

  calculateMove({
    board, // This provides a Chess.js instance of a board. See Chess.js on Github for implementation details.
    onUpdateResponse, // Call this function to update your "best" move. When time runs out, your engine will play this move.
    onFinish, // Call this function if you are done calculating, and just want to play a move.
  }: {
    board: Chess
    onUpdateResponse: (response: EngineResponse) => void
    onFinish: (response: EngineResponse) => void
  }) {
    const { move, evaluation, numberOfNodesSearched } = this.alexAlgo(
      board,
      onUpdateResponse
    )

    onFinish({
      move,
      evaluation,
      numberOfNodesSearched: numberOfNodesSearched.count,
    })

    return
  }

  /*
   * Calculates the maximum time in milliseconds your engine should think for
   * If onFinish is called first, your engine will not think for this long
   * If this time hits, then your engine will return the latest onUpdateResponse call
   */
  getCalculationTimeInMs(board: Chess): number {
    return 3000
  }

  alexAlgo(board: Chess, onUpdateResponse: (response: EngineResponse) => void) {
    // color determined by whose move it is
    const { move, evaluation } = this.negamax({
      board,
      depth: 3,
      alpha: -Infinity,
      beta: Infinity,
      onUpdateResponse,
    })

    console.log('move returned', move)
    console.log('evaluation returned', evaluation)

    return {
      move: move,
      evaluation: evaluation,
      numberOfNodesSearched: { count: 0 },
    }
  }

  negamax({
    board,
    depth,
    alpha,
    beta,
    onUpdateResponse,
  }: {
    board: Chess
    depth: number
    alpha: number
    beta: number
    onUpdateResponse: (response: EngineResponse) => void
  }): { move: Move | string; evaluation: number } {
    const color = board.turn() === 'w' ? 1 : -1
    const potentialMoves = board.moves()

    // first just get any move, score
    let bestMove = potentialMoves[0]
    let bestScore = this.evaluateBoard(board)

    if (depth === 0) {
      return { evaluation: color * bestScore, move: bestMove }
    }

    bestScore = -Infinity
    potentialMoves.sort((a, b) => {
      return 0.5 - Math.random()
    })
    for (const possibleMove of potentialMoves) {
      const boardCopy = new Chess(board.fen())
      boardCopy.move(possibleMove)
      const result = this.negamax({
        board: boardCopy,
        depth: depth - 1,
        alpha: -1 * beta,
        beta: -1 * alpha,
        onUpdateResponse,
      })
      console.log('in loop move returned', result.move)
      console.log('in loop eval returned', result.evaluation)
      const resultEvaluation = -1 * result.evaluation
      alpha = Math.max(bestScore, resultEvaluation)
      if (resultEvaluation > bestScore) {
        bestMove = possibleMove
        bestScore = resultEvaluation
        onUpdateResponse({
          move: bestMove,
          evaluation: bestScore,
          numberOfNodesSearched: 0,
        })
      }
      if (alpha >= beta) {
        break
      }
    }

    return {
      move: bestMove,
      evaluation: bestScore,
    }
  }

  evaluateBoard = (board: Chess) => {
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
          pointValue += 900
        } else if (square.type === 'k') {
          pointValue += 20000
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
}
