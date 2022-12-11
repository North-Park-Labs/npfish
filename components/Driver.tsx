import { Box, Button, Select, Stack } from '@chakra-ui/react'
import { Chess, Move } from 'chess.js'
import { RandomBot } from 'engines/RandomBot'
import { TeddyBot } from 'engines/TeddyBot'
import { Engine, Engines } from 'engines/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Chessboard } from 'react-chessboard'

export function Driver() {
  const [gameRender, setGameRender] = useState<Chess>(new Chess())
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false)

  const [whiteEngName, setWhiteEngName] = useState<string>('RandomBot')
  const [blackEngName, setBlackEngName] = useState<string>('RandomBot')

  const runGame = () => {
    setIsGameRunning(true)
    const game = new Chess()

    const whiteEngine = Engines.find((eng) => eng.name === whiteEngName)?.engine
    const blackEngine = Engines.find((eng) => eng.name === blackEngName)?.engine

    if (!whiteEngine || !blackEngine) {
      throw new Error('Could not find associated engine')
    }

    const makeMove = () => {
      let moveToMake: string | Move = ''
      if (game.turn() === 'w') {
        moveToMake = whiteEngine(new Chess(game.fen()))
      } else {
        moveToMake = blackEngine(new Chess(game.fen()))
      }

      console.log(moveToMake)
      game.move(moveToMake)
      setGameRender(new Chess(game.fen()))

      if (!game.isGameOver()) {
        setTimeout(makeMove, 1000)
      } else {
        setIsGameRunning(false)
      }
    }

    makeMove()
  }

  console.log(gameRender)

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
      <Box>
        <Select
          value={blackEngName}
          onChange={(e) => setBlackEngName(e.target.value)}
          disabled={isGameRunning}
        >
          {Engines.map((engine) => (
            <option key={engine.name} value={engine.name}>
              {engine.name}
            </option>
          ))}
        </Select>
        <Chessboard position={gameRender.fen()} />
        <Select
          value={whiteEngName}
          onChange={(e) => setWhiteEngName(e.target.value)}
          disabled={isGameRunning}
        >
          {Engines.map((engine) => (
            <option key={engine.name} value={engine.name}>
              {engine.name}
            </option>
          ))}
        </Select>
      </Box>
      <Box css={{ marginTop: 36 }}>
        <Stack direction="row">
          <Button onClick={() => runGame()} colorScheme="purple">
            Run Game
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
