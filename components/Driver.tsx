import { Box, Button, Select, Stack, Text } from '@chakra-ui/react'
import { Chess, Move } from 'chess.js'
import { RandomBot } from 'engines/RandomBot'
import { TeddyBot } from 'engines/TeddyBot'
import { EngineResponse, Engines } from 'engines/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Chessboard } from 'react-chessboard'

const FIVE_MINUTES_IN_SECONDS = 5 * 60

const formatClock = (seconds: number) => {
  const date = new Date(0)
  date.setSeconds(seconds)

  // Don't show hour if unnecessary
  if (seconds < 3600) {
    return date.toISOString().substring(14, 19)
  }

  return date.toISOString().substring(11, 19)
}

export function Driver() {
  const DEFAULT_CLOCK_VALUE = FIVE_MINUTES_IN_SECONDS

  const [gameRender, setGameRender] = useState<Chess>(new Chess())

  const [whiteEval, setWhiteEval] = useState<number>(0)
  const [blackEval, setBlackEval] = useState<number>(0)

  const [isGameRunning, setIsGameRunning] = useState<boolean>(false)

  const [whiteEngName, setWhiteEngName] = useState<string>('RandomBot')
  const [blackEngName, setBlackEngName] = useState<string>('Human')

  const [wClock, setWClock] = useState<number>(DEFAULT_CLOCK_VALUE)
  const [wInterval, setWInterval] = useState<NodeJS.Timer | null>(null)

  const [bClock, setBClock] = useState<number>(DEFAULT_CLOCK_VALUE)
  const [bInterval, setBInterval] = useState<NodeJS.Timer | null>(null)

  const [result, setResult] = useState<string | null>(null)

  const turn = gameRender.turn()

  useEffect(() => {
    if (isGameRunning) {
      if (turn === 'w') {
        if (bInterval) {
          clearInterval(bInterval)
          setBInterval(null)
        }
        if (!wInterval) {
          setWClock((old) => old - 1)

          const newInterval = setInterval(() => {
            setWClock((old) => old - 1)
          }, 1000)
          setWInterval(newInterval)
        }
      } else if (turn === 'b') {
        if (wInterval) {
          clearInterval(wInterval)
          setWInterval(null)
        }

        if (!bInterval) {
          setBClock((old) => old - 1)

          const newInterval = setInterval(() => {
            setBClock((old) => old - 1)
          }, 1000)
          setBInterval(newInterval)
        }
      }
    } else {
      if (wInterval) {
        clearInterval(wInterval)
        setWInterval(null)
      }

      if (bInterval) {
        clearInterval(bInterval)
        setBInterval(null)
      }
    }
  }, [turn, wClock, bClock, isGameRunning, wInterval, bInterval])

  useEffect(() => {
    if (wClock === 0) {
      setResult('Black')
      setIsGameRunning(false)
    }

    if (bClock === 0) {
      setResult('White')
      setIsGameRunning(false)
    }
  }, [wClock, bClock])

  const startGame = () => {
    if (whiteEngName === 'human' || blackEngName === 'human') {
      startHumanGame()
      return
    }

    setIsGameRunning(true)
    setResult(null)

    const game = new Chess()

    const makeMove = () => {
      const worker = new Worker(
        new URL('../workers/gameWorker.ts', import.meta.url)
      )
      worker.onmessage = (event: MessageEvent<EngineResponse>) => {
        if (game.turn() === 'w') {
          setWhiteEval(event.data.evaluation)
        } else {
          setBlackEval(event.data.evaluation)
        }

        game.move(event.data.move)
        setGameRender(new Chess(game.fen()))

        if (!game.isGameOver()) {
          setTimeout(makeMove, 500)
        } else {
          if (game.isDraw()) {
            setResult('Draw')
          } else {
            setResult(game.turn() === 'w' ? 'Black' : 'White')
          }
          setIsGameRunning(false)
        }
        worker.terminate()
      }

      worker.postMessage({
        engineName: game.turn() === 'w' ? whiteEngName : blackEngName,
        fen: game.fen(),
      })
    }

    makeMove()
  }

  const makeEngineMoveAgainstHuman = (gameInstance: Chess) => {
    const worker = new Worker(
      new URL('../workers/gameWorker.ts', import.meta.url)
    )
    worker.onmessage = (event: MessageEvent<EngineResponse>) => {
      if (gameInstance.turn() === 'w') {
        setWhiteEval(event.data.evaluation)
      } else {
        setBlackEval(event.data.evaluation)
      }

      const gameCopy = new Chess(gameInstance.fen())

      gameCopy.move(event.data.move)
      setGameRender(gameCopy)

      if (gameCopy.isGameOver()) {
        if (gameCopy.isDraw()) {
          setResult('Draw')
        } else {
          setResult(gameInstance.turn() === 'w' ? 'Black' : 'White')
        }
        setIsGameRunning(false)
      }
      worker.terminate()
    }

    console.log(gameRender.turn())
    worker.postMessage({
      engineName: gameInstance.turn() === 'w' ? whiteEngName : blackEngName,
      fen: gameInstance.fen(),
    })
  }

  const startHumanGame = () => {
    setIsGameRunning(true)
    setResult(null)
    setGameRender(new Chess())
    if (whiteEngName === 'human') {
      return
    }

    setTimeout(() => {
      makeEngineMoveAgainstHuman(new Chess())
    }, 500)
  }

  function onDrop(sourceSquare: string, targetSquare: string) {
    const gameCopy = new Chess(gameRender.fen())

    const result = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to a queen for example simplicity
    })

    setGameRender(gameCopy)

    // Illegal move??
    if (result === null) {
      return false
    }

    setTimeout(() => makeEngineMoveAgainstHuman(gameCopy), 500)
    return true
  }

  return (
    <Box
      css={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box css={{ display: 'flex' }}>
        <Box>
          <Box css={{ display: 'flex', alignItems: 'center' }}>
            <Select
              value={blackEngName}
              onChange={(e) => setBlackEngName(e.target.value)}
              disabled={isGameRunning}
            >
              <option value="Human">Human</option>
              {Engines.map((engine) => (
                <option key={engine.name} value={engine.name}>
                  {engine.name}
                </option>
              ))}
            </Select>
            <Box css={{ padding: '8px 64px' }}>
              <Text fontWeight="bold" fontSize="xl">
                {formatClock(bClock)}
              </Text>
            </Box>{' '}
          </Box>
          <Chessboard position={gameRender.fen()} onPieceDrop={onDrop} />
          <Box css={{ display: 'flex', alignItems: 'center' }}>
            <Select
              value={whiteEngName}
              onChange={(e) => setWhiteEngName(e.target.value)}
              disabled={isGameRunning}
            >
              <option value="Human">Human</option>
              {Engines.map((engine) => (
                <option key={engine.name} value={engine.name}>
                  {engine.name}
                </option>
              ))}
            </Select>
            <Box css={{ padding: '8px 64px' }}>
              <Text fontWeight="bold" fontSize="xl">
                {formatClock(wClock)}
              </Text>
            </Box>
          </Box>
        </Box>
        <Box css={{ marginLeft: 36 }}>
          {/* Add tooltip for people who do not know what Line Evaluation means */}
          <Text fontSize="2xl">Live Evaluation</Text>
          <Text>Black Engine: {blackEval}</Text>
          <Text>White Engine: {whiteEval}</Text>
          <Text fontSize="2xl" css={{ marginTop: 16 }}>
            Result
          </Text>
          <Text>{result ? result : 'In Progress'}</Text>
        </Box>
      </Box>
      <Box css={{ marginTop: 36 }}>
        <Stack direction="row">
          <Button onClick={() => startGame()} colorScheme="purple">
            Start Game
          </Button>
          {/* <Button
            onClick={() => {
              setIsGameRunning(false)
              setGameRender(new Chess())
            }}
            colorScheme="purple"
          >
            Reset Game
          </Button> */}
        </Stack>
      </Box>
    </Box>
  )
}
