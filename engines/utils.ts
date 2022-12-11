import { Chess, Move } from 'chess.js'

/**
 * DO NOT MODIFY DIRECTLY
 * If you want to modify, please c/p paste.
 *
 * @param board
 * @param depth
 * @param evaluationFunction - return postiive for better white position, negative for better black position
 */
export const minimax_EXAMPLE = (
  board: Chess,
  depth: number,
  evaluationFunction: (board: Chess) => number
): { move: Move | string; evaluation: number } => {
  const isMaximizing = board.turn() === 'w'

  const potentialMoves = board.moves()

  // Randomize order to add some variance
  potentialMoves.sort((a, b) => {
    return 0.5 - Math.random()
  })

  let bestEvaluation = isMaximizing ? -Infinity : Infinity
  let bestMove = potentialMoves[0]
  potentialMoves.forEach((move) => {
    const boardCopy = new Chess(board.fen())
    boardCopy.move(move)

    // This is our base case
    let childBestMove = move
    let childEvaluation = evaluationFunction(boardCopy)

    // This is our recursive case
    if (depth > 0) {
      const { move: mimMove, evaluation: mimEvaluation } = minimax_EXAMPLE(
        boardCopy,
        depth - 1,
        evaluationFunction
      )

      childBestMove = mimMove
      childEvaluation = mimEvaluation
    }

    if (isMaximizing) {
      if (childEvaluation > bestEvaluation) {
        bestEvaluation = childEvaluation
        bestMove = move
      }
    } else {
      if (childEvaluation < bestEvaluation) {
        bestEvaluation = childEvaluation
        bestMove = move
      }
    }
  })

  return {
    move: bestMove,
    evaluation: bestEvaluation,
  }
}
