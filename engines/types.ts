import { Chess, Move } from 'chess.js'

import { MinimaxDepth1, MinimaxDepth2 } from './MinimaxVariations'
import { RandomBot } from './RandomBot'
import { TeddyBot } from './TeddyBot'

export type Engine = (board: Chess) => string | Move

export const Engines = [
  {
    name: 'RandomBot',
    engine: RandomBot,
  },
  {
    name: 'Minimax Example (D1)',
    engine: MinimaxDepth1,
  },
  {
    name: 'Minimax Example (D2)',
    engine: MinimaxDepth2,
  },
  {
    name: 'TeddyBot',
    engine: TeddyBot,
  },
]
