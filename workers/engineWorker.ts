import { Chess } from 'chess.js'
import { EngineResponse, Engines } from 'engines/types'

addEventListener(
  'message',
  (
    event: MessageEvent<{
      engineName: string
      fen: string
    }>
  ) => {
    const EngineToUse = Engines.find(
      (eng) => eng.name === event.data.engineName
    )

    if (!EngineToUse) {
      throw new Error('Did not find engine in Engine Worker.')
    }

    const instance = new Chess(event.data.fen)
    const engine = new EngineToUse()

    const onUpdateResponse = (response: EngineResponse) => {
      postMessage({ type: 'update', response })
    }

    const onFinish = (response: EngineResponse) => {
      postMessage({ type: 'finish', response })
    }

    engine.calculateMove({ board: instance, onUpdateResponse, onFinish })
  }
)
