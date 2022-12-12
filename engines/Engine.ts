import { Chess } from 'chess.js'

import { EngineResponse } from './types'

export abstract class Engine {
  abstract name: string

  abstract calculateMove({
    board,
    onUpdateResponse,
    onFinish,
  }: {
    board: Chess
    onUpdateResponse: (response: EngineResponse) => void
    onFinish: (response: EngineResponse) => void
  }): void
  abstract getCalculationTimeInMs(board: Chess): number
}
