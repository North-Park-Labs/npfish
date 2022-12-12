import { Chess, Move } from 'chess.js'

import { Engine } from './Engine'
import { EngineResponse } from './types'

// TODO: Update the class name
export class TemplateBot extends Engine {
  name = 'TemplateBot' // TODO: Update the engine name here

  calculateMove({
    board, // This provides a Chess.js instance of a board. See Chess.js on Github for implementation details.
    onUpdateResponse, // Call this function to update your "best" move. When time runs out, your engine will play this move.
    onFinish, // Call this function if you are done calculating, and just want to play a move.
  }: {
    board: Chess
    onUpdateResponse: (response: EngineResponse) => void
    onFinish: (response: EngineResponse) => void
  }) {
    const moves = board.moves()
    const move = moves[Math.floor(Math.random() * moves.length)]

    onFinish({
      move,
      evaluation: 0,
      numberOfNodesSearched: moves.length,
    })

    return
  }

  // This calculates the maximum time in milliseconds your engine should think for
  // If onFinish is called first, your engine will not think for this long
  // If this time hits, then your engine will return the latest onUpdateResponse call
  getCalculationTimeInMs(board: Chess): number {
    return 3000
  }
}
