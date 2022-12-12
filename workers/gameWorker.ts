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
      throw new Error('Did not find engine in Game Worker.')
    }

    const instance = new Chess(event.data.fen)
    const engine = new EngineToUse()

    let response: EngineResponse = {
      move: instance.moves()[0],
      evaluation: 0,
      numberOfNodesSearched: 0,
    }

    const timeoutInMs = engine.getCalculationTimeInMs(instance)

    let responded = false

    const engineWorker = new Worker(
      new URL('./engineWorker.ts', import.meta.url)
    )

    setTimeout(() => {
      if (!responded) {
        engineWorker.terminate()
        postMessage(response)
        responded = true
      }
    }, timeoutInMs)

    engineWorker.onmessage = (
      event: MessageEvent<{
        type: 'update' | 'finish'
        response: EngineResponse
      }>
    ) => {
      if (event.data.type === 'update') {
        response = event.data.response
      } else if (event.data.type === 'finish') {
        response = event.data.response
        engineWorker.terminate()

        if (!responded) {
          postMessage(response)
          responded = true
        }
      }
    }

    engineWorker.postMessage(event.data)
  }
)
