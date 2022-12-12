import { Chess, Move } from 'chess.js'

import { Engine } from './Engine'
import { EngineResponse } from './types'

export class RandomBot extends Engine {
  name = 'RandomBot'

  calculateMove({
    board,
    onUpdateResponse,
    onFinish,
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

  getCalculationTimeInMs(board: Chess): number {
    return 3000
  }
}
