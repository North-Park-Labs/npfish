import { Chess } from 'chess.js'
import { Engines } from 'engines/types'

addEventListener(
  'message',
  (
    event: MessageEvent<{
      engineName: string
      fen: string
    }>
  ) => {
    const engineToUse = Engines.find(
      (eng) => eng.name === event.data.engineName
    )?.engine

    if (!engineToUse) {
      throw new Error('Did not find engine.')
    }

    const instance = new Chess(event.data.fen)
    const engineResponse = engineToUse(instance)

    postMessage(engineResponse)
  }
)
