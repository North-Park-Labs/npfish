import { Move } from 'chess.js'

import { AlexBot } from './AlexBot'
import { BasicMinimaxD23S } from './BasicMinimax'
import { RandomBot } from './RandomBot'
import { TeddyBot } from './TeddyBot'

export type EngineResponse = {
  move: string | Move
  evaluation: number
  numberOfNodesSearched: number
}

export const Engines = [RandomBot, BasicMinimaxD23S, TeddyBot, AlexBot]
